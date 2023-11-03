import { FormEvent, type Dispatch, type SetStateAction } from 'react';

import type { Status } from '@/hooks/useSignUpFunnel';
import { toUpperCaseFirstLetter } from '@/libs/utils';
import {
  Schema,
  type SchemaKey,
  validatedOnChange,
} from '@/libs/utils/validate';
import InputWithLabel from '../InputWithLabel';

type Props = {
  step: string;
  status: Status;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  current: string | File;
  setCurrent: Dispatch<SetStateAction<string | File>>;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
};

export default function StepSignUp({
  step,
  status,
  onSubmit,
  current,
  setCurrent,
  error,
  setError,
}: Props) {
  if (status === 'loading') return <div>loading</div>;
  if (status === 'fulfilled') return <div>done</div>;
  if (status === 'rejected') return <div>fail</div>;

  if (step === 'profile_image') {
    return (
      <form key={step} onSubmit={onSubmit}>
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (!e.target.files || e.target.files.length === 0) return;
            setCurrent(e.target.files[0]);
          }}
        />
      </form>
    );
  }

  const stepWithText = step as SchemaKey;
  if (Schema[stepWithText]) {
    return (
      <form key={step} onSubmit={onSubmit}>
        <InputWithLabel
          label={toUpperCaseFirstLetter(step)}
          type={step}
          value={current as string}
          onChange={validatedOnChange({
            schema: Schema[stepWithText],
            setValue: setCurrent as Dispatch<SetStateAction<string>>,
            setError,
          })}
          error={error}
        />
      </form>
    );
  }

  return (
    <form key={step} onSubmit={onSubmit}>
      <InputWithLabel
        label={toUpperCaseFirstLetter(step)}
        type={step}
        value={current as string}
        onChange={(e) => setCurrent(e.target.value)}
        error={error}
      />
    </form>
  );
}
