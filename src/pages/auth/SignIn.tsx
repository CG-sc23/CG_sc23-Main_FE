import Card from '@/components/Card';
import InputWithLabel from '@/components/InputWithLabel';
import { colors } from '@/components/constant/color';
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
    props.bgColor ? props.bgColor : colors.blue300};
  color: ${(props) => (props.color ? props.color : colors.white)};

  border-radius: 5px;
  font-size: larger;
  font-weight: 600;
  cursor: pointer;
`;

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
            setter={setEmail}
          />
          <InputWithLabel
            type="password"
            label="Password"
            value={password}
            setter={setPassword}
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
          <Button>Login with Google</Button>
          <Button bgColor={colors.green300}>Login with Naver</Button>
        </div>
        <Link href="/auth/SignUp?step=email">Sign Up</Link>
      </Card>
    </div>
  );
}
