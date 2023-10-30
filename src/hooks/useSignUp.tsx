import client from '@/api/client';
// import { useGoogleLogin } from '@react-oauth/google';
import { useFunnel } from '@toss/use-funnel';
import { useState } from 'react';

export declare type NonEmptyArray<T> = readonly [T, ...T[]];

type UseSignUpType<T = NonEmptyArray<string>> = {
  step: T;
};

const SIGN_UP_TYPE = {
  WITH_EMAIL: 'default',
  GOOGLE: 'google',
  KAKAO: 'kakao',
} as const;

export default function useSignUp<T>({ step }: UseSignUpType) {
  const [Funnel, state, setStep] = useFunnel(step).withState({});
  const [preAccess, setPreAccess] = useState<null | string>(null);

  // const google = useGoogleLogin({
  //   onSuccess: (code) => {
  //     const {data} = client.signUpWithGoogle(code);
  //     if(data.ok) setPreAccess(data.token)
  //   },
  //   flow: 'auth-code',
  //   redirect_uri: 'http://127.0.0.1:8000/auth/v1/social/google',
  //   ux_mode: 'popup',
  // });

  // const kakao = () => {};

  const withEmail = () => {};

  function updateState(target: string, update: string) {
    setStep((prev) => ({
      ...prev,
      [target]: update,
    }));
  }

  function getState(target) {
    return state[target];
  }

  function getSignUpEvent(type: typeof SIGN_UP_TYPE) {
    const { WITH_EMAIL, GOOGLE, KAKAO } = SIGN_UP_TYPE;
    switch (type) {
      case WITH_EMAIL:
        return withEmail;
      // case GOOGLE:
      //   return google;
      // case KAKAO:
      //   return kakao;
      default:
        throw Error('No match sign up type.');
    }
  }

  return {
    Funnel,
    updateState,
    getState,
  };
}
