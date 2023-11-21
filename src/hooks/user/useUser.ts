import client from '@/api/client';
import { queryKey } from '@/libs/constant';
import { assert } from '@/libs/utils/assert';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { safeLocalStorage } from '@toss/storage';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AUTH_PATHS = ['/auth/SignIn', '/auth/SignUp'];

export default function useUser() {
  const router = useRouter();
  const accessToken = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
  const queryClient = useQueryClient();
  const {
    data: user,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ['USER_INFO'],
    queryFn: async () => {
      assert(accessToken, 'No accessToken');
      const res = await client.userInfo({ token: accessToken });
      if (!res?.ok) throw Error(res?.reason);
      return res;
    },
    enabled: !!accessToken,
    retry: 0,
  });

  useEffect(() => {
    if (!accessToken) return;

    if (AUTH_PATHS.includes(router.pathname)) {
      router.replace('/');
    }
  }, [accessToken, router]);

  if (error) {
    queryClient.removeQueries({ queryKey: ['USER_INFO'], exact: true });
    safeLocalStorage.remove(queryKey.USER_ACCESS_TOKEN);
    safeLocalStorage.remove('USER_INFO');

    router.push('/auth/SignIn');
  }

  return {
    isLoggedIn: !!accessToken,
    user: user?.ok ? user : null,
    isLoading,
    refetch,
  };
}
