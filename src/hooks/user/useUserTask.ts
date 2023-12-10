import client from '@/api/client';
import { queryKey } from '@/libs/constant';
import { assert } from '@/libs/utils/assert';
import { useQuery } from '@tanstack/react-query';
import { safeLocalStorage } from '@toss/storage';

export default function useUserTask(id: string) {
  const accessToken = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);

  const {
    data: userTasksInfo,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['USER_TASKS_INFO'],
    queryFn: async () => {
      assert(accessToken, 'No accessToken');
      const res = await client.userTasksInfo({
        token: accessToken,
        user_id: id,
      });

      if (!res?.ok) throw Error(res?.reason);
      return res;
    },
    enabled: !!accessToken,
    retry: 0,
  });

  return {
    tasks: userTasksInfo?.ok ? userTasksInfo.tasks : null,
    isLoading,
    refetch,
  };
}
