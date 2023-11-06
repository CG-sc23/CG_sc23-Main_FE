import client from '@/api/client';
import { mutationKey, queryKey } from '@/libs/constant';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { safeLocalStorage } from '@toss/storage';
import { useRouter } from 'next/navigation';

export default function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: signOut } = useMutation({
    mutationKey: [mutationKey.AUTH_SIGN_OUT],
    mutationFn: () => {
      const token = queryClient.getQueryData([
        queryKey.USER_ACCESS_TOKEN,
      ]) as string;
      if (!token) throw Error('No Token');
      return client.signOut({ token });
    },
    onSuccess: (res) => {
      if (!res) return;
      if (res?.ok) {
        queryClient.removeQueries({ queryKey: [queryKey.USER_ACCESS_TOKEN] });
        safeLocalStorage.remove(queryKey.USER_ACCESS_TOKEN);
        return router.push('/auth/SignIn');
      }
    },
  });

  return {
    signOut,
  };
}
