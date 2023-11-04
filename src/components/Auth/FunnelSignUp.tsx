import { FormEvent, useState } from 'react';
import useSignUpFunnel from '@/hooks/useSignUpFunnel';
import StepSignUp from './StepSignUp';

const list = [
  'email',
  'password',
  'name',
  'profile_image',
  'github_link',
  'short_description',
] as const;

const optionalList = ['profile_image', 'github_link', 'short_description'];

export default function FunnelSignUp() {
  const [current, setCurrent] = useState<string | File>('');
  const [error, setError] = useState('');
  const { Funnel, steps, onNextStep, onPrevStep, status } = useSignUpFunnel(
    list,
    {
      afterStepChange: setCurrent,
    },
  );
  const isDisabled =
    (current === '' || error !== '') && !optionalList.includes(status);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      return onNextStep(file);
    }

    onNextStep(current);
  }

  return (
    <>
      <Funnel>
        {steps.map((val) => {
          return (
            <Funnel.Step name={val} key={val}>
              <StepSignUp
                step={val}
                status={status}
                onSubmit={onSubmit}
                current={current}
                setCurrent={setCurrent}
                error={error}
                setError={setError}
              />
            </Funnel.Step>
          );
        })}
      </Funnel>
      <div>
        <button type="button" onClick={onPrevStep}>
          prev
        </button>
        <button
          type="button"
          onClick={() => onNextStep(current)}
          disabled={isDisabled}
        >
          next
        </button>
      </div>
    </>
  );
}
