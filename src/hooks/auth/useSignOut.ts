import client from '@/api/client';
import { mutationKey, queryKey } from '@/libs/constant';
import { assert } from '@/libs/utils/assert';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { safeLocalStorage } from '@toss/storage';
import { useRouter } from 'next/navigation';

export default function useSignOut() {
  const accessToken = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: signOut } = useMutation({
    mutationKey: [mutationKey.AUTH_SIGN_OUT],
    mutationFn: () => {
      assert(accessToken, 'No accessToken');
      return client.signOut({ token: accessToken });
    },
    onSuccess: (res) => {
      if (!res) return;
      if (!res?.ok) return;
      queryClient.removeQueries({ queryKey: ['USER_INFO'], exact: true });
      safeLocalStorage.remove(queryKey.USER_ACCESS_TOKEN);
      return router.push('/auth/SignIn');
    },
  });

  return {
    signOut,
  };
}
