import client from '@/api/client';
import { useFunnel } from '@toss/use-funnel';
import { type NonEmptyArray, QS } from '@toss/utils';
import { useState } from 'react';

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
  const [status, setStatus] = useState<Status>('pending');
  const steps = [...list, DONE] as NonEmptyArray<string>;
  type State = {
    [key in (typeof steps)[number]]?: string | File;
  };
  const [Funnel, state, setStep] = useFunnel(steps, {
    initialStep: steps.at(0),
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

      setStatus('loading');
      // eslint-disable-next-line no-console
      const result = await client.signUp(formData).catch(console.error);
      if (result?.data.ok) return setStatus('fulfilled');
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

  return {
    Funnel,
    steps,
    onPrevStep,
    onNextStep,
    status,
  };
}
