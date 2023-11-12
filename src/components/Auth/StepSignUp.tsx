import { FormEvent, type Dispatch, type SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import type { Status } from "@/hooks/auth/useSignUpFunnel";
import {
  Schema,
  type SchemaKey,
  validatedOnChange,
} from "@/libs/utils/validate";

import client from "@/api/client";
import InputWithLabel from "../InputWithLabel";
import { colors } from "../constant/color";
import Dropzone from "../Dropzone";
import SignUpSuccess from "./SignUp/Success";
import SignUpFail from "./SignUp/Fail";

type Props = {
  step: string;
  stepCount: number;
  title: string;
  subTitle: string;
  status: Status;
  current: string | File;
  setCurrent: Dispatch<SetStateAction<string | File>>;
  nextStep: (update: string | File) => void;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  isDisabled: boolean;
};

const Header = styled.h1`
  margin-bottom: 3rem;
  font-weight: 500;
  font-size: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const DropZoneWrapper = styled.div`
  width: 18rem;
  height: 16rem;
  margin-bottom: 2rem;
`;

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
  const [code, setCode] = useState("");
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
        'input[name="email"]'
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
        'input[name="email"]'
      ) as HTMLInputElement | null;
      if (!emailInput) return;
      const emailValue = emailInput.value;

      const codeInput = form.querySelector(
        'input[name="code"]'
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
      if (!result?.ok) return setError("유효하지 않은 토큰입니다.");
      setCodeVerified(true);
      setError("");
      return;
    }

    nextStep(current);
  }

  // 이메일 입력 시 버튼 내 텍스트 변경
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

  // 이메일 입력 상태 전이
  function getEmailDisabled() {
    if (!sentCode) {
      return isDisabled;
    }
    if (!codeVerified) {
      return !code;
    }
    return false;
  }

  // 회원가입 완료 후 대기
  if (status === "loading") {
    return <></>;
  }

  // 회원가입 완료 후 성공
  if (status === "fulfilled") return <SignUpSuccess></SignUpSuccess>;

  // 회원가입 완료 후 실패
  if (status === "rejected") return <SignUpFail></SignUpFail>;

  // step 정보
  const stepWithText = step as SchemaKey;

  // 1. email 입력 단계
  if (stepWithText === "email") {
    return (
      <motion.form
        onSubmit={onSubmitEmail}
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
        `}
      >
        <Header>{title}</Header>
        {/* email 입력 */}
        <InputWithLabel
          label={subTitle}
          type={step}
          name={step}
          value={current as string}
          onChange={validatedOnChange({
            schema: Schema[stepWithText],
            setValue: setCurrent as Dispatch<SetStateAction<string>>,
            setError,
          })}
          error=""
          readonly={sentCode}
        />
        {/* code 입력 */}
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
        <motion.button
          css={css`
            width: 100%;
            padding: 0.8rem 0;
            border-radius: 0.5rem;
            font-size: 1.2rem;
            color: ${colors.white};
            background-color: ${getEmailDisabled()
              ? colors.grey500
              : colors.black};
            cursor: ${getEmailDisabled() ? "not-allowed" : "pointer"};
            transition: background-color 0.2s ease;
            :hover {
              background-color: ${getEmailDisabled()
                ? colors.grey600
                : colors.black};
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

  // 프로필 이미지 입력 단계
  if (step === "profile_image") {
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
          <Dropzone
            onFileAdded={(file) => setCurrent(file)}
            isDisabled={isDisabled}
          />
        </DropZoneWrapper>
        <button
          css={css`
            width: 100%;
            padding: 0.8rem 0;
            border-radius: 0.5rem;
            font-size: 1.2rem;
            color: ${colors.white};
            background-color: ${isDisabled ? colors.grey500 : colors.black};
            cursor: ${isDisabled ? "not-allowed" : "pointer"};
            transition: background-color 0.2s ease;
            :hover {
              background-color: ${isDisabled ? colors.grey600 : colors.black};
            }
          `}
          type="submit"
          disabled={isDisabled}
        >
          다음 ({stepCount}/6)
        </button>
      </Form>
    );
  }

  // 그 외의 단계들
  if (Schema[stepWithText]) {
    return (
      <Form key={step} onSubmit={onSubmit}>
        <Header>{title}</Header>
        <InputWithLabel
          label={subTitle}
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
            width: 100%;
            padding: 0.8rem 0;
            border-radius: 0.5rem;
            font-size: 1.2rem;
            color: ${colors.white};
            background-color: ${isDisabled ? colors.grey500 : colors.black};
            cursor: ${isDisabled ? "not-allowed" : "pointer"};
            transition: background-color 0.2s ease;
            :hover {
              background-color: ${isDisabled ? colors.grey600 : colors.black};
            }
          `}
          type="submit"
          disabled={isDisabled}
        >
          다음 ({stepCount}/6)
        </button>
      </Form>
    );
  }

  return (
    <Form key={step} onSubmit={onSubmit}>
      <Header>{title}</Header>
      <InputWithLabel
        label={subTitle}
        type={step}
        value={current as string}
        onChange={(e) => setCurrent(e.target.value)}
        error={error}
      />
      <button
        css={css`
          width: 100%;
          padding: 0.8rem 0;
          border-radius: 0.5rem;

          font-size: 1.2rem;
          color: ${colors.white};
          background-color: ${isDisabled ? colors.grey500 : colors.black};
          cursor: ${isDisabled ? "not-allowed" : "pointer"};
          transition: background-color 0.2s ease;
          :hover {
            background-color: ${isDisabled ? colors.grey600 : colors.black};
          }
        `}
        type="submit"
        disabled={isDisabled}
      >
        다음 ({stepCount}/6)
      </button>
    </Form>
  );
}
