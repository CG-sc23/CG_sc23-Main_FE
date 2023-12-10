import client from '@/api/client';
import { queryKey } from '@/libs/constant';
import { useQuery } from '@tanstack/react-query';
import { safeLocalStorage } from '@toss/storage';
import { useRouter } from 'next/router';

export default function useGetTask() {
  const router = useRouter();
  const id = router.query.task_id ?? router.query.id;
  const {
    data: task,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['TASK', id],
    queryFn: async () => {
      const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
      if (!id) return null;

      const res = await client.TaskInfo({
        token: token ?? undefined,
        task_id: id as string,
      });

      if (!res?.ok) return null;
      return res;
    },
    enabled: !!router.query.id,
  });

  return {
    task,
    isLoading,
    refetch,
  };
}
