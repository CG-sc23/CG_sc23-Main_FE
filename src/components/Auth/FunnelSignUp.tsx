import { useState } from 'react';
import useSignUpFunnel from '@/hooks/auth/useSignUpFunnel';
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

  const { Funnel, steps, nextStep, status } = useSignUpFunnel(list, {
    afterStepChange: setCurrent,
  });

  const isDisabled =
    (current === '' || error !== '') && !optionalList.includes(status);

  return (
    <Funnel>
      {steps.map((val) => {
        return (
          <Funnel.Step name={val} key={val}>
            <StepSignUp
              step={val}
              status={status}
              current={current}
              setCurrent={setCurrent}
              error={error}
              nextStep={nextStep}
              setError={setError}
              isDisabled={isDisabled}
            />
          </Funnel.Step>
        );
      })}
    </Funnel>
  );
}
