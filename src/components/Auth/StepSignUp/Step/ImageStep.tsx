import { css } from '@emotion/react';

import Dropzone from '@/components/Dropzone';
import { Button, DropZoneWrapper, Form, Header } from '../common';
import { Dispatch, FormEvent, SetStateAction } from 'react';

type ImageStepProps = {
  image: File;
  setImage: Dispatch<SetStateAction<File>>;
  step: string;
  stepCount: number;
  title: string;
  nextStep: (update: string | File) => void;
};

export default function ImageStep({
  image,
  setImage,
  step,
  stepCount,
  title,
  nextStep,
}: ImageStepProps) {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    return nextStep(image);
  }

  return (
    <Form
      key={step}
      onSubmit={onSubmit}
      css={css`
        gap: 2rem;
      `}
    >
      <Header>{title}</Header>
      <DropZoneWrapper>
        <Dropzone onFileAdded={(file) => setImage(file)} />
      </DropZoneWrapper>
      <Button type="submit">다음 ({stepCount}/6)</Button>
    </Form>
  );
}
