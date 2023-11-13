import { type Dispatch, type SetStateAction } from 'react';

import type { StatusType } from '@/hooks/auth/useSignUpFunnel';
import { type SchemaKey } from '@/libs/utils/validate';

import Status from './Status';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/Spinner';
const EmailStep = dynamic(() => import('./Step/EmailStep'), {
  ssr: true,
  loading: () => <LoadingSpinner />,
});
const ImageStep = dynamic(() => import('./Step/ImageStep'), {
  ssr: true,
  loading: () => <LoadingSpinner />,
});
const LinkStep = dynamic(() => import('./Step/LinkStep'), {
  ssr: true,
  loading: () => <LoadingSpinner />,
});
const PlainTextStep = dynamic(() => import('./Step/PlainTextStep'), {
  ssr: true,
  loading: () => <LoadingSpinner />,
});

type Props = {
  step: string;
  stepCount: number;
  title: string;
  subTitle: string;
  status: StatusType;
  current: string | File;
  setCurrent: Dispatch<SetStateAction<string | File>>;
  nextStep: (update: string | File) => void;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  isDisabled: boolean;
};

export default function StepSignUp({
  step,
  stepCount,
  title,
  subTitle,
  status,
  current,
  setCurrent,
  error,
  nextStep,
  setError,
  isDisabled,
}: Props) {
  if (status !== 'pending') return <Status status={status} />;

  if (step === 'profile_image') {
    return (
      <ImageStep
        image={current as File}
        setImage={setCurrent as Dispatch<SetStateAction<File>>}
        step={step}
        stepCount={stepCount}
        title={title}
        nextStep={nextStep}
      />
    );
  }

  const stepWithText = step as SchemaKey;

  if (stepWithText === 'email') {
    return (
      <EmailStep
        email={current as string}
        setEmail={setCurrent as Dispatch<SetStateAction<string>>}
        step={step}
        stepCount={stepCount}
        title={title}
        subTitle={subTitle}
        error={error}
        setError={setError}
        isDisabled={isDisabled}
        nextStep={nextStep}
      />
    );
  }

  if (stepWithText === 'github_link') {
    return (
      <LinkStep
        link={current as string}
        setLink={setCurrent as Dispatch<SetStateAction<string>>}
        step={step}
        stepCount={stepCount}
        title={title}
        subTitle={subTitle}
        error={error}
        setError={setError}
        isDisabled={isDisabled}
        nextStep={nextStep}
      />
    );
  }

  return (
    <PlainTextStep
      text={current as string}
      setText={setCurrent as Dispatch<SetStateAction<string>>}
      step={step}
      stepCount={stepCount}
      title={title}
      subTitle={subTitle}
      error={error}
      setError={setError}
      isDisabled={isDisabled}
      nextStep={nextStep}
    />
  );
}
