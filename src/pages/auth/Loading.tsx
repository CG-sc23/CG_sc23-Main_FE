import client from '@/api/client';
import { Provider, SocialAuthResponse } from '@/libs/type/client';
import { socialPreAccessToken } from '@/store';
import { InferGetServerSidePropsType, type GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';

type RedirectUrl = {
  code: string | null;
  isNaver: boolean;
};

export const getServerSideProps = (async (context) => {
  const { query } = context;

  const code = query.code ? (query.code as string) : null;
  const isNaver = Boolean(query.state);

  return {
    props: {
      code,
      isNaver,
    },
  };
}) satisfies GetServerSideProps<RedirectUrl>;

export default function Loading({
  code,
  isNaver,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [error, setError] = useState('');
  const setPreAccessToken = useSetRecoilState(socialPreAccessToken);
  const router = useRouter();

  const auth = useCallback(
    async (authCode: string, provider: Provider) => {
      const res = await client
        .socialAuth({
          provider,
          code: authCode,
        })
        // eslint-disable-next-line no-console
        .catch(console.error);

      if (!res?.data) return;
      const { data } = res as { data: SocialAuthResponse; status: number };

      if (data.reason) {
        return setError(data.reason);
      }

      //* 2-2. 결과 받고 아톰에 저장 / 회원가입 창으로 이동.
      if (!data.isUser && data.preAccessToken) {
        setPreAccessToken(data.preAccessToken);
        return router.replace('/auth/SignUp');
      }

      //* 2-1. 로그인 처리
      if (data.isUser && data.token) {
        // eslint-disable-next-line no-console
        return console.log('TODO: login');
      }
    },
    [router, setPreAccessToken],
  );

  useEffect(() => {
    if (!code) return;

    if (isNaver) auth(code, 'NAVER');
    else auth(code, 'KAKAO');
  }, [auth, code, isNaver]);

  return (
    <>
      <div>Loading</div>
      {error && <div>{error}</div>}
    </>
  );
}
