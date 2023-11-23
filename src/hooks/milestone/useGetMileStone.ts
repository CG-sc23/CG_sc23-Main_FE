import client from '@/api/client';
import { queryKey } from '@/libs/constant';
import { useQuery } from '@tanstack/react-query';
import { safeLocalStorage } from '@toss/storage';
import { useRouter } from 'next/router';

export default function useGetMileStone() {
  const router = useRouter();
  const {
    data: milestone,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['MILESTONE', router.query.id],
    queryFn: async () => {
      const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
      const id = router.query.id;
      if (!id) return null;

      const res = await client.milestoneInfo({
        token: token ?? undefined,
        milestone_id: id as string,
      });

      if (!res?.ok) return null;
      return res;
    },
    enabled: !!router.query.id,
  });

  return {
    milestone,
    isLoading,
    refetch,
  };
}
