import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

import useSignIn from '@/hooks/auth/useSignIn';
import { Schema, validatedOnChange } from '@/libs/utils/validate';

import Card from '@/components/Card';
import { colors } from '@/components/constant/color';
import InputWithLabel from '@/components/InputWithLabel';

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
    props.bgColor ? props.bgColor : colors.yellow300};
  color: ${(props) => (props.color ? props.color : colors.white)};

  border-radius: 5px;
  font-size: larger;
  font-weight: 600;
  cursor: pointer;
`;

const errorVariants = {
  initial: {
    opacity: 0.2,
    y: '-10px',
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { signIn, kakao, naver, error } = useSignIn();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn({ email, password });
  };

  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <Card>
        <div
          css={css`
            width: 5rem;
            height: 5rem;
            background-color: aqua;
            margin: auto;
            border-radius: 50%;
          `}
        />
        <Form onSubmit={onSubmit}>
          <span
            css={css`
              padding: 0 2rem;
              font-size: 1.5rem;

              word-break: break-all;
              line-break: auto;
              text-align: center;
            `}
          >
            By logging in, you accept our <Link href="/">terms</Link> and
            privacy <Link href="/">policy</Link>.
          </span>
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
            Login
          </Button>
          <motion.div
            variants={errorVariants}
            initial="initial"
            animate={error !== '' ? 'animate' : 'initial'}
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
            display: flex;
            gap: 16px;
            color: ${colors.grey300};
          `}
        >
          <hr
            css={css`
              border: none;
              outline: none;

              background-color: ${colors.grey300};
              height: 1px;
              flex: 1;
            `}
          />
          OR
          <hr
            css={css`
              border: none;
              outline: none;

              background-color: ${colors.grey300};
              height: 1px;
              flex: 1;
            `}
          />
        </div>
        <div
          css={css`
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 10px;
          `}
        >
          <Button onClick={kakao}>Login with KAKAO</Button>
          <Button onClick={naver} bgColor={colors.green300}>
            Login with Naver
          </Button>
        </div>
        <Link href="/auth/SignUp?step=email">Sign Up</Link>
      </Card>
    </div>
  );
}
