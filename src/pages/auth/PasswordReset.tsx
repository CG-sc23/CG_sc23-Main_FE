import client from "@/api/client";
import LayoutContainer from "@/components/Auth/LayoutContainer";
import InputWithLabel from "@/components/InputWithLabel";
import { colors } from "@/components/constant/color";
import { toUpperCaseFirstLetter } from "@/libs/utils";
import { Schema, validatedOnChange } from "@/libs/utils/validate";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Button = styled.button<{ bgColor?: string }>`
  background: none;
  outline: none;
  border: none;

  padding: 1rem 0;

  background-color: ${(props) =>
    props.bgColor ? props.bgColor : colors.blue300};
  color: ${(props) => (props.color ? props.color : colors.white)};

  border-radius: 5px;
  font-size: larger;
  font-weight: 600;
  cursor: pointer;
`;

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const [sentCode, setSentCode] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const isDisabled = (current: string, error: string) =>
    current === "" || error !== "";

  async function onSubmitPasswordReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const emailInput = form.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement | null;
    const codeInput = form.querySelector(
      'input[name="code"]'
    ) as HTMLInputElement | null;
    const passwordInput = form.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement | null;

    if (!sentCode) {
      if (!emailInput) return;
      const emailValue = emailInput.value;

      // TODO Sent Code
      setIsLoading(true);
      const result = await client
        .passwordReset({ email: emailValue })
        // eslint-disable-next-line no-console
        .catch(console.error)
        .finally(() => setIsLoading(false));

      if (!result) return;
      if (!result?.ok) return setEmailError(result?.reason as string);
      return setSentCode(true);
    }

    if (!codeVerified) {
      if (!emailInput) return;
      const emailValue = emailInput.value;

      if (!codeInput) return;
      const codeValue = codeInput.value;

      // TODO Code Verified
      setIsLoading(true);
      const result = await client
        .passwordResetCheck({ email: emailValue, token: codeValue })
        // eslint-disable-next-line no-console
        .catch(console.error)
        .finally(() => setIsLoading(false));

      if (!result) return;
      if (!result?.ok) return setCodeError(result?.reason as string);

      return setCodeVerified(true);
    }

    if (!passwordVerified) {
      if (!emailInput) return;
      const emailValue = emailInput.value;

      if (!codeInput) return;
      const codeValue = codeInput.value;

      if (!passwordInput) return;
      const passwordValue = passwordInput.value;

      // TODO Password Verified
      const result = await client
        .passwordResetConfirm({
          email: emailValue,
          token: codeValue,
          new_password: passwordValue,
        })
        // eslint-disable-next-line no-console
        .catch(console.error)
        .finally(() => setIsLoading(false));

      if (!result) return;
      if (!result?.ok) return setPasswordError(result?.reason as string);

      return setPasswordVerified(true);
    }

    // TODO After Password Reset
    router.push("/auth/SignIn");
  }

  function getTitleText() {
    if (!sentCode) {
      return "이메일을 입력하세요.";
    }
    if (!codeVerified) {
      return "인증코드를 입력하세요.";
    }
    if (!passwordVerified) {
      return "새로운 비밀번호를 입력해주세요.";
    }
    return "새로운 비밀번호로 로그인 해주세요.";
  }

  function getButtonText() {
    if (isLoading) {
      return "로딩 중";
    }

    if (!sentCode) {
      return "인증번호 전송";
    }
    if (!codeVerified) {
      return "인증번호 확인";
    }
    if (!passwordVerified) {
      return "새 비밀번호 입력";
    }
    return "확인";
  }

  function getDisabled() {
    if (!sentCode) {
      return isDisabled(email, emailError);
    }
    if (!codeVerified) {
      return isDisabled(code, codeError);
    }
    if (!passwordVerified) {
      return isDisabled(password, passwordError);
    }

    return false;
  }

  return (
    <LayoutContainer>
      <div
        css={css`
          width: 5rem;
          height: 5rem;
          background-color: aqua;
          margin: auto;
          border-radius: 50%;
        `}
      />
      <Form onSubmit={onSubmitPasswordReset}>
        <span
          css={css`
            padding: 0 2rem;
            font-size: 1.5rem;

            word-break: break-all;
            line-break: auto;
            text-align: center;
          `}
        >
          {getTitleText()}
        </span>
        <InputWithLabel
          label={toUpperCaseFirstLetter("email")}
          type="email"
          name="email"
          value={email}
          onChange={validatedOnChange({
            schema: Schema.email,
            setValue: setEmail,
            setError: setEmailError,
          })}
          error={emailError}
          readonly={sentCode}
        />
        {sentCode ? (
          <InputWithLabel
            label={toUpperCaseFirstLetter("code")}
            type="text"
            name="code"
            value={code as string}
            onChange={(e) => setCode(e.target.value)}
            readonly={codeVerified}
            error={codeError}
          />
        ) : null}
        {codeVerified ? (
          <InputWithLabel
            label={toUpperCaseFirstLetter("password")}
            type={"password"}
            name="password"
            value={password}
            onChange={validatedOnChange({
              schema: Schema.password,
              setValue: setPassword,
              setError: setPasswordError,
            })}
            error={passwordError}
          />
        ) : null}
        <Button
          css={css`
            background: none;
            outline: none;
            border: none;

            width: 100%;
            padding: 0.8rem 0;
            border-radius: 10px;

            font-size: 1.2rem;
            color: ${colors.white};
            background-color: ${getDisabled()
              ? colors.blue200
              : colors.blue400};
            cursor: ${getDisabled() ? "not-allowed" : "pointer"};

            transition: background-color 0.2s ease;

            :hover {
              background-color: ${getDisabled()
                ? colors.blue100
                : colors.blue300};
            }
          `}
          type="submit"
          disabled={getDisabled()}
        >
          {getButtonText()}
        </Button>
      </Form>
    </LayoutContainer>
  );
}
