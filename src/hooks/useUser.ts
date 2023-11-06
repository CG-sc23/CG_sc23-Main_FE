import { queryKey } from '@/libs/constant';
import { useQuery } from '@tanstack/react-query';
import { safeLocalStorage } from '@toss/storage';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function useUser() {
  const router = useRouter();
  const { data: accessToken } = useQuery({
    queryKey: [queryKey.USER_ACCESS_TOKEN],
    queryFn: async () => safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN),
  });

  useEffect(() => {
    if (!accessToken) return () => {};
    if (
      router.pathname === '/auth/SignIn' ||
      router.pathname === '/auth/SignUp'
    ) {
      router.replace('/');
    }
  }, [router, accessToken]);
}
