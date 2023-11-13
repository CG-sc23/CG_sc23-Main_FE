import { Dispatch, FormEvent, SetStateAction } from 'react';
import { Schema, SchemaKey, validatedOnChange } from '@/libs/utils/validate';

import InputWithLabel from '@/components/InputWithLabel';
import { Button, Form, Header } from '../common';

type EmailStepProps = {
  text: string;
  setText: Dispatch<SetStateAction<string>>;
  step: string;
  stepCount: number;
  title: string;
  subTitle: string;
  isDisabled: boolean;
  nextStep: (update: string | File) => void;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
};

export default function PlainTextStep({
  text,
  setText,
  step,
  stepCount,
  title,
  subTitle,
  isDisabled,
  nextStep,
  error,
  setError,
}: EmailStepProps) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    nextStep(text);
  }

  return (
    <Form key={step} onSubmit={onSubmit}>
      <Header>{title}</Header>
      <InputWithLabel
        label={subTitle}
        type={step}
        value={text}
        onChange={validatedOnChange({
          schema: Schema[step as SchemaKey] || null,
          setValue: setText,
          setError,
        })}
        error={error}
      />
      <Button type="submit" disabled={isDisabled}>
        다음 ({stepCount}/6)
      </Button>
    </Form>
  );
}
