import { FormEvent, type Dispatch, type SetStateAction, useState } from 'react';
import { motion } from 'framer-motion';
import { css } from '@emotion/react';

import type { Status } from '@/hooks/auth/useSignUpFunnel';
import { toUpperCaseFirstLetter } from '@/libs/utils';
import {
  Schema,
  type SchemaKey,
  validatedOnChange,
} from '@/libs/utils/validate';

import client from '@/api/client';
import InputWithLabel from '../InputWithLabel';
import { colors } from '../constant/color';
import Dropzone from '../Dropzone';

type Props = {
  step: string;
  status: Status;
  current: string | File;
  setCurrent: Dispatch<SetStateAction<string | File>>;
  nextStep: (update: string | File) => void;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  isDisabled: boolean;
};

export default function StepSignUp({
  step,
  status,
  current,
  setCurrent,
  error,
  nextStep,
  setError,
  isDisabled,
}: Props) {
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      return nextStep(file);
    }

    nextStep(current);
  }

  async function onSubmitEmail(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    if (!sentCode) {
      const emailInput = form.querySelector(
        'input[name="email"]',
      ) as HTMLInputElement | null;
      if (!emailInput) return;

      const emailValue = emailInput.value;

      setIsLoading(true);
      const result = await client
        .signUpEmailVerify({ email: emailValue })
        // eslint-disable-next-line no-console
        .catch(console.error)
        .finally(() => setIsLoading(false));

      if (!result) return;
      if (!result?.ok) return setError(result?.reason as string);
      setSentCode(true);
      return;
    }

    if (!codeVerified) {
      const emailInput = form.querySelector(
        'input[name="email"]',
      ) as HTMLInputElement | null;
      if (!emailInput) return;
      const emailValue = emailInput.value;

      const codeInput = form.querySelector(
        'input[name="code"]',
      ) as HTMLInputElement | null;
      if (!codeInput) return;

      const codeValue = codeInput.value;

      setIsLoading(true);
      const result = await client
        .signUpEmailVerifyConfirm({
          email: emailValue,
          token: codeValue,
        })
        // eslint-disable-next-line no-console
        .catch(console.error)
        .finally(() => setIsLoading(false));
      if (!result) return;
      if (!result?.ok) return setError(result?.reason as string);
      setCodeVerified(true);
      return;
    }

    nextStep(current);
  }

  function getButtonText() {
    if (isLoading) {
      return '작업 중';
    }
    if (!sentCode) {
      return '인증번호 전송';
    }
    if (!codeVerified) {
      return '인증번호 확인';
    }
    return '다음';
  }

  function getEmailDisabled() {
    if (!sentCode) {
      return isDisabled;
    }
    if (!codeVerified) {
      return !code;
    }

    return false;
  }

  if (status === 'loading') return <div>loading</div>;
  if (status === 'fulfilled') return <div>done</div>;
  if (status === 'rejected') return <div>fail</div>;

  if (step === 'profile_image') {
    return (
      <form key={step} onSubmit={onSubmit}>
        <Dropzone
          onFileAdded={(file) => setCurrent(file)}
          isDisabled={isDisabled}
        />
        <button
          css={css`
            background: none;
            outline: none;
            border: none;

            width: 100%;
            padding: 0.8rem 0;
            border-radius: 10px;

            font-size: 1.2rem;
            color: ${colors.white};
            background-color: ${isDisabled ? colors.blue200 : colors.blue400};
            cursor: ${isDisabled ? 'not-allowed' : 'pointer'};

            transition: background-color 0.2s ease;

            :hover {
              background-color: ${isDisabled ? colors.blue100 : colors.blue300};
            }
          `}
          type="submit"
          disabled={isDisabled}
        >
          다음
        </button>
      </form>
    );
  }

  const stepWithText = step as SchemaKey;
  if (stepWithText === 'email') {
    return (
      <motion.form onSubmit={onSubmitEmail}>
        <InputWithLabel
          label={toUpperCaseFirstLetter(step)}
          type={step}
          name={step}
          value={current as string}
          onChange={validatedOnChange({
            schema: Schema[stepWithText],
            setValue: setCurrent as Dispatch<SetStateAction<string>>,
            setError,
          })}
          error={error}
          readonly={sentCode}
        />
        {sentCode ? (
          <InputWithLabel
            label="인증번호"
            type="text"
            name="code"
            value={code as string}
            onChange={(e) => setCode(e.target.value)}
            readonly={codeVerified}
            error={error}
          />
        ) : null}
        <motion.button
          css={css`
            background: none;
            outline: none;
            border: none;

            width: 100%;
            padding: 0.8rem 0;
            border-radius: 10px;

            font-size: 1.2rem;
            color: ${colors.white};
            background-color: ${getEmailDisabled()
              ? colors.blue200
              : colors.blue400};
            cursor: ${getEmailDisabled() ? 'not-allowed' : 'pointer'};

            transition: background-color 0.2s ease;

            :hover {
              background-color: ${getEmailDisabled()
                ? colors.blue100
                : colors.blue300};
            }
          `}
          type="submit"
          disabled={getEmailDisabled()}
        >
          {getButtonText()}
        </motion.button>
      </motion.form>
    );
  }

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
        <button
          css={css`
            background: none;
            outline: none;
            border: none;

            width: 100%;
            padding: 0.8rem 0;
            border-radius: 10px;

            font-size: 1.2rem;
            color: ${colors.white};
            background-color: ${isDisabled ? colors.blue200 : colors.blue400};
            cursor: ${isDisabled ? 'not-allowed' : 'pointer'};

            transition: background-color 0.2s ease;

            :hover {
              background-color: ${isDisabled ? colors.blue100 : colors.blue300};
            }
          `}
          type="submit"
          disabled={isDisabled}
        >
          다음
        </button>
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
      <button
        css={css`
          background: none;
          outline: none;
          border: none;

          width: 100%;
          padding: 0.8rem 0;
          border-radius: 10px;

          font-size: 1.2rem;
          color: ${colors.white};
          background-color: ${isDisabled ? colors.blue200 : colors.blue400};
          cursor: ${isDisabled ? 'not-allowed' : 'pointer'};

          transition: background-color 0.2s ease;

          :hover {
            background-color: ${isDisabled ? colors.blue100 : colors.blue300};
          }
        `}
        type="submit"
        disabled={isDisabled}
      >
        다음
      </button>
    </form>
  );
}
