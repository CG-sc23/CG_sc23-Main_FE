import client from '@/api/client';
import { useQuery } from '@tanstack/react-query';

export default function useGetAllProject() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['PROJECT_ALL'],
    queryFn: async () => {
      const res = await client.allProjectInfo();

      if (!res?.ok) return null;
      return res.projects;
    },
  });

  return {
    projects,
    isLoading,
  };
}
