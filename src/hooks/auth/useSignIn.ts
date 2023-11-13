import client from '@/api/client';
import { mutationKey, queryKey } from '@/libs/constant';
import { SignInPayload, SignInResponse } from '@/libs/type/client';
import { useMutation } from '@tanstack/react-query';
import { safeLocalStorage } from '@toss/storage';
import { useRouter } from 'next/navigation';
import useSnackBar from '../useSnackBar';

export default function useSignIn() {
  const router = useRouter();
  const { openSnackBar } = useSnackBar();

  const { mutate: signIn } = useMutation<
    SignInResponse | undefined,
    unknown,
    SignInPayload
  >({
    mutationKey: [mutationKey.AUTH_SIGN_IN],
    mutationFn: (params) => {
      return client.signIn({ email: params.email, password: params.password });
    },
    onSuccess: (res) => {
      if (!res) return;
      if (res?.ok && res.token) {
        safeLocalStorage.set(queryKey.USER_ACCESS_TOKEN, res.token);
        return router.push('/');
      }

      return openSnackBar('이메일, 비밀번호를 다시 확인해주세요!');
    },
  });

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

  const socialLogin = (token: string) => {
    safeLocalStorage.set(queryKey.USER_ACCESS_TOKEN, token);
    return router.push('/');
  };

  return {
    naver,
    kakao,
    signIn,
    socialLogin,
  };
}
