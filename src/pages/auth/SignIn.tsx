import Card from '@/components/Card';
import InputWithLabel from '@/components/InputWithLabel';
import { colors } from '@/components/constant/color';
import { Schema, validatedOnChange } from '@/libs/utils/validate';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Link from 'next/link';
import { useState } from 'react';

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

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const naver = () => {
    const CLIENT_ID = '6fRIFafpI7oj_rMCEl1w';
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&state=domomainweb!@&redirect_uri=http://localhost:3000/auth/Loading`;
    window.location.href = NAVER_AUTH_URL;
  };

  const kakao = () => {
    const CLIENT_ID = '692654ded92217544ec272739b534375';
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=http://localhost:3000/auth/Loading`;
    window.location.href = KAKAO_AUTH_URL;
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
        <Form>
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
