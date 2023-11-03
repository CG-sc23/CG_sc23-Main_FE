import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import client from '@/api/client';
import { socialPreAccessToken } from '@/store';
import { useFunnel } from '@toss/use-funnel';
import { type NonEmptyArray, QS } from '@toss/utils';
import { useRouter } from 'next/router';

type List = NonEmptyArray<string> | readonly string[];
type Options = {
  afterStepChange: (current: string | File) => void;
};
export type Status = 'loading' | 'fulfilled' | 'rejected' | 'pending' | string;
const DONE = 'done';

export default function useSignUpFunnel(
  list: List,
  { afterStepChange }: Options,
) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('pending');
  const preAccessToken = useRecoilValue(socialPreAccessToken);
  const steps = [...list, DONE] as NonEmptyArray<string>;
  type State = {
    [key in (typeof steps)[number]]?: string | File;
  };
  if (!steps.includes('email') || !steps.includes('password')) {
    throw new Error('Steps에 이메일과 비밀번호가 필요합니다.');
  }
  if (
    steps.findIndex((step) => step === 'email') !== 0 ||
    steps.findIndex((step) => step === 'password') !== 1
  ) {
    throw new Error('이메일과 비밀번호는 각각 첫번째 두번째 단계여야 합니다.');
  }

  const initialStep = preAccessToken
    ? steps.at(steps.findIndex((step) => step === 'password') + 1)
    : steps.at(0);
  const [Funnel, state, setStep] = useFunnel(steps, {
    initialStep,
    stepQueryKey: 'step',
    onStepChange: async (name) => {
      afterStepChange(state[name] ?? '');

      if (name !== DONE) return setStatus(name);
      const formData = new FormData();
      Object.entries(state).forEach((s) => {
        const [key, val] = s;
        if (key === DONE || key === 'step') return;
        if (!val) return;

        formData.append(key, val);
      });
      if (preAccessToken) formData.append('pre_access_token', preAccessToken);

      setStatus('loading');
      // eslint-disable-next-line no-console
      const result = await client.signUp(formData).catch(console.error);
      if (result?.data?.ok) return setStatus('fulfilled');
      return setStatus('rejected');
    },
  }).withState<State>({});

  function onPrevStep() {
    const target = QS.get('step') as (typeof steps)[number] | undefined;
    if (target === undefined) return;

    const index = steps.findIndex((v) => v === target);
    if (index === 0 || state[steps[index - 1]] === '') return;

    setStep((prev) => ({
      ...prev,
      step: steps[index - 1],
    }));
  }

  function onNextStep(update: string | File) {
    const target = QS.get('step') as (typeof steps)[number] | undefined;
    if (target === undefined) return;

    const index = steps.findIndex((v) => v === target);
    if (index === steps.length - 1) return;

    setStep((prev) => ({
      ...prev,
      step: steps[index + 1],
      [target]: update,
    }));
  }

  useEffect(() => {
    if (router.query?.step) return;
    router.replace({
      query: { ...router.query, step: initialStep },
    });
  }, [router, initialStep]);

  return {
    Funnel,
    steps,
    status,
    onPrevStep,
    onNextStep,
  };
}
