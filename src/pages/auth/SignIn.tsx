import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { AiOutlineRight } from 'react-icons/ai';

import useSignIn from '@/hooks/auth/useSignIn';
import { Schema, validatedOnChange } from '@/libs/utils/validate';

import LayoutContainer from '@/components/Auth/LayoutContainer';
import { colors } from '@/components/constant/color';
import InputWithLabel from '@/components/InputWithLabel';

const Form = styled.form`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Button = styled.button<{ bgColor?: string; color?: string }>`
  padding: 1rem 0;
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.color ?? 'white'};
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const HR = styled.hr`
  width: 100%;
  color: gray;
  border: 0.5px solid ${colors.grey700};
`;

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { signIn, kakao, naver } = useSignIn();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Logged In');
    signIn({ email, password });
  };

  return (
    <LayoutContainer>
      {/* login with email & password find */}
      <Form onSubmit={onSubmit}>
        <InputWithLabel
          type="email"
          label="이메일"
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
          label="비밀번호"
          value={password}
          error={passwordError}
          autoFocus={false}
          onChange={validatedOnChange({
            schema: Schema.password,
            setValue: setPassword,
            setError: setPasswordError,
          })}
        />
        <Link
          href="/auth/PasswordReset"
          css={css`
            position: absolute;
            right: 0;
            bottom: 5.5rem;
            font-size: 0.8rem;
          `}
        >
          비밀번호 찾기
        </Link>
        <Button type="submit" bgColor={colors.black}>
          로그인
        </Button>
      </Form>
      {/* break */}
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
          width: 100%;
          margin-top: 1rem;
        `}
      >
        <HR />
        OR
        <HR />
      </div>
      {/* social login */}
      <div
        css={css`
          width: 100%;
          position: relative;
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `}
      >
        <Button onClick={kakao} bgColor={colors.kakao} color={'black'}>
          카카오 소셜 로그인
        </Button>
        <Button onClick={naver} bgColor={colors.naver} color={'white'}>
          네이버 소셜 로그인
        </Button>
      </div>
      {/* sign up */}
      <div
        css={css`
          width: 100%;
          margin-top: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        `}
      >
        <span
          css={css`
            font-size: 0.8rem;
            color: ${colors.grey500};
          `}
        >
          아직 회원가입을 안하셨나요? 3초 만에
        </span>
        <Link
          href="/auth/SignUp?step=email"
          css={css`
            display: flex;
            gap: 0.5rem;
            color: ${colors.grey800};
          `}
        >
          {' '}
          가입하기 <AiOutlineRight />
        </Link>
      </div>
    </LayoutContainer>
  );
}
