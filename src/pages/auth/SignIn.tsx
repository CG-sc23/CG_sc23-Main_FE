import Link from "next/link";
import { FormEvent, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";

import useSignIn from "@/hooks/auth/useSignIn";
import { Schema, validatedOnChange } from "@/libs/utils/validate";

import LayoutContainer from "@/components/Auth/LayoutContainer";
import { colors } from "@/components/constant/color";
import InputWithLabel from "@/components/InputWithLabel";

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Button = styled.button<{ bgColor?: string; color?: string }>`
  padding: 1rem 0;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.color ?? "white"};
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const errorVariants = {
  initial: {
    opacity: 0.2,
    y: "-10px",
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { signIn, kakao, naver, error, isPending } = useSignIn();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("로그인");
    signIn({ email, password });
  };

  return (
    <LayoutContainer>
      <Form onSubmit={onSubmit}>
        <InputWithLabel
          type="email"
          label="Email"
          value={email}
          error={emailError}
          onChange={validatedOnChange({
            schema: Schema.email,
            setValue: setEmail,
            setError: setEmailError,
          })}
        />
        <InputWithLabel
          type="password"
          label="Password"
          value={password}
          error={passwordError}
          autoFocus={false}
          onChange={validatedOnChange({
            schema: Schema.password,
            setValue: setPassword,
            setError: setPasswordError,
          })}
        />
        <Button type="submit" bgColor={colors.black}>
          {isPending ? "작업 중" : "로그인"}
        </Button>
        <motion.div
          variants={errorVariants}
          initial="initial"
          animate={error !== "" ? "animate" : "initial"}
          exit="initial"
          css={css`
            padding: 0.2rem 0;
            height: 1.5rem;
            font-size: 1rem;
            color: ${colors.red400};
          `}
        >
          {error}
        </motion.div>
      </Form>
      <div
        css={css`
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `}
      >
        <Button onClick={kakao} bgColor={colors.kakao} color={"black"}>
          Login with KAKAO
        </Button>
        <Button onClick={naver} bgColor={colors.naver} color={"white"}>
          Login with Naver
        </Button>
      </div>
      <div
        css={css`
          width: 100%;
          display: flex;
          justify-content: space-between;
        `}
      >
        <Link href="/auth/SignUp?step=email">Sign Up</Link>
        <Link href="/auth/PasswordReset">Find Password</Link>
      </div>
    </LayoutContainer>
  );
}
