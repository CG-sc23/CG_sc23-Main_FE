/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Provider, SocialAuthResponse } from '@/libs/type/client';
import { mutationKey, queryKey } from '@/libs/constant';
import client from '@/api/client';

import { useQueryParam } from '../useQueryParam';
import useSignIn from './useSignIn';

type AuthParams = {
  authCode: string;
  provider: Provider;
};

export default function useSocialAuth() {
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const code = useQueryParam('code');
  const state = useQueryParam('state');
  const queryClient = useQueryClient();
  const { socialLogin } = useSignIn();

  const { mutate: socialAuth } = useMutation<
    SocialAuthResponse | undefined,
    unknown,
    AuthParams
  >({
    mutationKey: [mutationKey.AUTH_SOCIAL],
    mutationFn: ({ authCode, provider }) =>
      client.socialAuth({ provider, code: authCode }),

    onSuccess: (data) => {
      if (!data) return router.back();
      if (data.reason) return setError(data.reason);

      if (!data.isUser && data.preAccessToken) {
        queryClient.setQueryData(
          [queryKey.PRE_ACCESS_TOKEN],
          data.preAccessToken,
        );
        router.replace('/auth/SignUp');
      }

      if (data.isUser && data.token) {
        socialLogin(data.token);
      }
    },

    onError: (e: unknown) => {
      console.error(e);
      setError('An error occurred during social authentication');
    },
  });

  useEffect(() => {
    const isNaver = Boolean(state);
    if (!code) return;

    const provider = isNaver ? 'NAVER' : 'KAKAO';
    socialAuth({ authCode: code, provider });
  }, [code]);

  return { error };
}
