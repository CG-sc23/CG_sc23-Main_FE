import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { css } from '@emotion/react';

import client from '@/api/client';
import { Schema, validatedOnChange } from '@/libs/utils/validate';

import InputWithLabel from '@/components/InputWithLabel';
import { colors } from '@/components/constant/color';
import { Button, Form, Header } from '../common';

type EmailStepProps = {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  step: string;
  stepCount: number;
  title: string;
  subTitle: string;
  isDisabled: boolean;
  nextStep: (update: string | File) => void;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
};

export default function EmailStep({
  email,
  setEmail,
  step,
  stepCount,
  title,
  subTitle,
  isDisabled,
  nextStep,
  error,
  setError,
}: EmailStepProps) {
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.querySelector(
      'input[name="email"]',
    ) as HTMLInputElement | null;
    const codeInput = form.querySelector(
      'input[name="code"]',
    ) as HTMLInputElement | null;

    if (!sentCode) {
      if (!emailInput) return;
      const emailValue = emailInput.value;

      setIsLoading(true);

      const result = await client
        .signUpEmailVerify({ email: emailValue })
        .catch(console.error)
        .finally(() => setIsLoading(false));

      if (!result) return;
      if (!result?.ok) return setError(result?.reason as string);

      setSentCode(true);
      setError('');
      return;
    }

    if (!codeVerified) {
      if (!emailInput) return;
      const emailValue = emailInput.value;

      if (!codeInput) return;
      const codeValue = codeInput.value;

      setIsLoading(true);
      const result = await client
        .signUpEmailVerifyConfirm({
          email: emailValue,
          token: codeValue,
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));

      if (!result) return;
      if (!result?.ok) return setError('유효하지 않은 토큰입니다.');

      setCodeVerified(true);
      setError('');
      return;
    }

    nextStep(email);
  }

  function getButtonText() {
    if (isLoading) {
      return `잠시만 기다려 주세요...`;
    }
    if (!sentCode) {
      return `인증번호 전송 (${stepCount}/6)`;
    }
    if (!codeVerified) {
      return `인증번호 확인 (${stepCount}/6)`;
    }
    return `다음 (${stepCount}/6)`;
  }

  function getDisabled() {
    if (!sentCode) {
      return isDisabled;
    }
    if (!codeVerified) {
      return !code;
    }
    return false;
  }

  return (
    <Form onSubmit={onSubmit}>
      <Header>{title}</Header>
      <InputWithLabel
        label={subTitle}
        type={step}
        name={step}
        value={email}
        onChange={validatedOnChange({
          schema: Schema.email,
          setValue: setEmail,
          setError,
        })}
        error={error}
        readonly={sentCode}
      />
      {sentCode ? (
        <div
          css={css`
            position: relative;
            width: 100%;
          `}
        >
          <InputWithLabel
            label="인증번호"
            type="text"
            name="code"
            value={code as string}
            onChange={(e) => setCode(e.target.value)}
            readonly={codeVerified}
            error={error}
          />
          {codeVerified ? (
            <span
              css={css`
                position: absolute;
                top: 3rem;
                font-size: 0.8rem;
                font-weight: 600;
                color: ${colors.green700};
              `}
            >
              인증 완료!
            </span>
          ) : null}
        </div>
      ) : null}
      <Button type="submit" disabled={getDisabled()}>
        {getButtonText()}
      </Button>
    </Form>
  );
}
