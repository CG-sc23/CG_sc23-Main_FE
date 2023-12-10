import client from '@/api/client';
import { queryKey } from '@/libs/constant';
import { useQuery } from '@tanstack/react-query';
import { safeLocalStorage } from '@toss/storage';
import { useRouter } from 'next/router';

export default function useGetProject() {
  const router = useRouter();
  const id = router.query.project_id ?? router.query.id;
  const {
    data: project,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['PROJECT', id],
    queryFn: async () => {
      const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
      if (!id) return null;

      const res = await client.projectInfo({
        token: token ?? undefined,
        project_id: id as string,
      });

      if (!res?.ok) return null;
      return res;
    },
    enabled: !!id,
  });

  return {
    project,
    isLoading,
    refetch,
  };
}
