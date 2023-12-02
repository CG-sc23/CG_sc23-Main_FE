import { queryKey } from '@/libs/constant';
import styled from '@emotion/styled';
import { safeLocalStorage } from '@toss/storage';
import { bpmax } from '@/libs/styles/constants';
import { Chunk } from '@/components/Feed/Chunk';

import { numberToString } from '@/libs/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import client from '@/api/client';

import {
  PaginateTaskListsResponse,
  RecommendProjectResponse,
  RecommendedUserResponse,
} from '@/libs/type/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { assert } from '@/libs/utils/assert';

import {
  PaginatedTask,
  Project as RecommendedProject,
  RecommendedUser,
} from '@/libs/type/client';

// Container for main page
const Container = styled.div`
  width: 896px;

  /* mobile */
  ${bpmax[0]} {
    width: 100%;
  }
`;

type ChunkList = {
  chunk: {
    tasks: PaginatedTask[] | undefined;
    projects: RecommendedProject[] | undefined;
    users: RecommendedUser[] | undefined;
  }[];
  page: number;
};

// SSR
export const getServerSideProps = (async () => {
  const initiallyFetchedTasks = await client.PaginatedTaskLists({
    page_id: numberToString(1),
  });
  assert(initiallyFetchedTasks, 'Problem fetching task lists.');

  const initiallyFetchedProjects = await client.recommendProject({});
  assert(initiallyFetchedProjects, 'Problem fetching project lists.');

  const initiallyFetchedUsers = await client.recommendUser({});
  assert(initiallyFetchedUsers, 'Problem fetching user lists.');

  return {
    props: {
      initiallyFetchedTasks,
      initiallyFetchedProjects,
      initiallyFetchedUsers,
    },
  };
}) satisfies GetServerSideProps<{
  initiallyFetchedTasks: PaginateTaskListsResponse;
  initiallyFetchedProjects: RecommendProjectResponse;
  initiallyFetchedUsers: RecommendedUserResponse;
}>;

// Home
export default function Home({
  initiallyFetchedTasks,
  initiallyFetchedProjects,
  initiallyFetchedUsers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
  const [chunks, setChunks] = useState<ChunkList>({
    chunk: [
      {
        tasks: initiallyFetchedTasks.tasks as PaginatedTask[],
        projects: initiallyFetchedProjects.projects as RecommendedProject[],
        users: initiallyFetchedUsers.users as RecommendedUser[],
      },
    ],
    page: 1,
  });
  const targetRef = useRef<HTMLDivElement>(null);

  const fetchTasks = async () => {
    const data = await client.PaginatedTaskLists({
      page_id: numberToString(chunks.page + 1),
    });
    if (!data?.ok) {
      assert('task fetching failed : ' + data?.reason);
    }
    return data?.tasks;
  };

  const fetchRecommendedProjects = async () => {
    const data = await client.recommendProject({
      token: token ? token : undefined,
    });
    if (!data?.ok) {
      assert('project recommendation fetching failed : ' + data?.reason);
    }
    return data?.projects;
  };

  const fetchRecommendedFriends = async () => {
    const data = await client.recommendUser({
      token: token ? token : undefined,
    });
    if (!data?.ok) {
      assert('friend recommendation fetching failed : ' + data?.reason);
    }
    return data?.users;
  };

  const handleIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting) {
        const fetchChunk = async () => {
          const tasks = await fetchTasks();
          const projects = await fetchRecommendedProjects();
          const users = await fetchRecommendedFriends();
          return { tasks, projects, users };
        };
        fetchChunk()
          .then((res) => {
            if (res.tasks?.length === 0) return;
            setChunks((prev) => {
              return {
                chunk: [...prev.chunk, res],
                page: prev.page + 1,
              };
            });
          })
          .catch((error) => console.error(error));
      }
    },
    [chunks.chunk],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.3,
      root: null,
    });

    targetRef.current && observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, targetRef.current]);

  return (
    <Container>
      {chunks.chunk.map((chunk, index) => (
        <Chunk
          key={index}
          chunk={chunk}
          page={index}
          innerRef={chunks.chunk.length === index + 1 ? targetRef : null}
        />
      ))}
    </Container>
  );
}
