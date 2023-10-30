/* eslint-disable react/jsx-no-bind */
import { useState } from 'react';
import { useFunnel } from '@toss/use-funnel';
import { QS } from '@toss/utils';

import client from '@/api/client';
import InputWithLabel from '../InputWithLabel';

const Steps = [
  'email',
  'password',
  'name',
  'description',
  'short_description',
  'done',
] as const;
type TState = {
  [key in (typeof Steps)[number]]?: string;
};

export default function FunnelSignUp() {
  const [current, setCurrent] = useState('');
  const [Funnel, state, setStep] = useFunnel(Steps, {
    initialStep: 'email',
    stepQueryKey: 'step',
    onStepChange: (name) => {
      setCurrent(state[name] ?? '');
      // eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
      if (name === 'done') client.signUp(state as any);
    },
  }).withState<TState>({});

  function prevStep() {
    const target = QS.get('step') as (typeof Steps)[number] | undefined;
    if (target === undefined) return;

    const index = Steps.findIndex((v) => v === target);
    if (index === 0 || state[Steps[index - 1]] === '') return;

    setStep((prev) => ({
      ...prev,
      step: Steps[index - 1],
    }));
  }

  function nextStep(update: string) {
    const target = QS.get('step') as (typeof Steps)[number] | undefined;
    if (target === undefined) return;
    const index = Steps.findIndex((v) => v === target);

    if (index === Steps.length - 1) return;

    setStep((prev) => ({
      ...prev,
      step: Steps[index + 1],
      [target]: update,
    }));
  }

  return (
    <>
      <Funnel>
        {Steps.map((val) => (
          <Funnel.Step name={val} key={val}>
            {val === 'done' ? (
              <div key={val}>done</div>
            ) : (
              <form
                key={val}
                onSubmit={(e) => {
                  e.preventDefault();
                  nextStep(current);
                }}
              >
                <InputWithLabel
                  label={val.charAt(0).toUpperCase() + val.slice(1)}
                  type={val}
                  value={current}
                  setter={setCurrent}
                />
              </form>
            )}
          </Funnel.Step>
        ))}
      </Funnel>
      <div>
        <button type="button" onClick={prevStep}>
          prev
        </button>
        <button
          type="button"
          onClick={() => nextStep(current)}
          disabled={!current}
        >
          next
        </button>
      </div>
    </>
  );
}
