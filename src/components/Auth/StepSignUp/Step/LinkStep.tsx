import { Dispatch, FormEvent, SetStateAction, useState } from 'react';

import client from '@/api/client';
import { Schema, validatedOnChange } from '@/libs/utils/validate';

import InputWithLabel from '@/components/InputWithLabel';
import { Button, Form, Header } from '../common';
import { colors } from '@/components/constant/color';
import { css } from '@emotion/react';

type EmailStepProps = {
  link: string;
  setLink: Dispatch<SetStateAction<string>>;
  step: string;
  stepCount: number;
  title: string;
  subTitle: string;
  isDisabled: boolean;
  nextStep: (update: string | File) => void;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
};

export default function LinkStep({
  link,
  setLink,
  step,
  stepCount,
  title,
  subTitle,
  isDisabled,
  nextStep,
  error,
  setError,
}: EmailStepProps) {
  const [linkVerified, setLinkVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const linkVerifiedWithLink = !!(link && linkVerified);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!linkVerified) {
      setIsLoading(true);

      const result = await client
        .gitHubAccountCheck({ github_link: link })
        .catch(console.error)
        .finally(() => setIsLoading(false));

      if (!result) return;
      if (!result?.ok) return setError(result?.reason as string);

      setLinkVerified(true);
      return;
    }

    nextStep(link);
  }

  function getButtonText() {
    if (isLoading) {
      return `잠시만 기다려 주세요...`;
    }
    if (!linkVerified) {
      return `유효 링크 확인 (${stepCount}/6)`;
    }
    return `다음 (${stepCount}/6)`;
  }

  function getDisabled() {
    if (!linkVerified) {
      return isDisabled;
    }

    return false;
  }

  const handleChange = validatedOnChange({
    schema: Schema.github_link,
    setValue: setLink,
    setError,
  });

  return (
    <Form onSubmit={onSubmit}>
      <Header>{title}</Header>
      <div
        css={css`
          position: relative;
          width: 100%;
        `}
      >
        <InputWithLabel
          label={subTitle}
          type={step}
          value={link}
          readonly={linkVerifiedWithLink}
          onChange={(e) => {
            if (e.target.value.length === 0) setLinkVerified(true);
            if (linkVerified) setLinkVerified(false);

            handleChange(e);
            if (e.target.value.length === 0) setError('');
          }}
          error={error}
        />
        {linkVerifiedWithLink ? (
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
      <Button type="submit" disabled={getDisabled()}>
        {getButtonText()}
      </Button>
    </Form>
  );
}
