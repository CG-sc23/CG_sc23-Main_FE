import { useQueryParam } from '@/hooks/useQueryParam';
import { useQuery } from '@tanstack/react-query';

type Project = {
  id: string;
  owner: string;
  status: string;
  title: string;
  short_description: string;
  description?: string;
  created_at: string;
  like: number;
  is_public: boolean;
};
type ProjectList = {
  ok: boolean;
  count: number;
  list: Project[];
};
const dummyData: Project[] = [
  {
    id: 'asdgsagsd',
    owner: 'asdf',
    title: 'qwer',
    like: 1,
    is_public: true,
    short_description: 'Hello World!',
    status: 'pending',
    created_at: '2020',
  },
  {
    id: 'weqgwegweqgweg',
    owner: 'asdf',
    title: 'qwer',
    like: 1,
    is_public: true,
    short_description: 'Hello World!',
    status: 'pending',
    created_at: '2020',
  },
];
const dummyProjectList = (id: string): Promise<ProjectList> =>
  new Promise((resolve, reject) => {
    setTimeout(
      () =>
        resolve({
          ok: true,
          count: dummyData.length,
          list: dummyData,
        }),
      100,
    );
  });

export default function Project() {
  const id = useQueryParam('id');
  const { data, isLoading } = useQuery({
    queryKey: ['USER_PROJECT', id],
    queryFn: async () => {
      const res = await dummyProjectList(id as string);

      return res.list;
    },
    enabled: !!id,
  });

  return null;
}
