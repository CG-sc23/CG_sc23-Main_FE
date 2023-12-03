import { ForwardedRef, ReactNode, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { bpmax } from '@/libs/styles/constants';
import {
  PaginatedTask,
  Project as RecommendedProject,
  RecommendedUser,
} from '@/libs/type/client';
import { Block } from '@/components/Feed/Block';
import { Task } from '@/components/Feed/Task';
import { Carousel } from '@/components/Feed/Carousel';
import { Project } from '@/components/Feed/Project';
import { Commerce } from '@/components/Feed/Commerce';
import { User } from '@/components/Feed/User';
import { numberToString } from '@/libs/utils';
import client from '@/api/client';

import { Advertise } from '@/libs/type/client';

type Props = {
  innerRef: ForwardedRef<HTMLDivElement>;
  chunk: {
    tasks: PaginatedTask[] | undefined;
    projects: RecommendedProject[] | undefined;
    users: RecommendedUser[] | undefined;
  };
  page: number;
};

const Container = styled.div`
  width: 100%;
  padding: 1rem 2rem 0 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  ${bpmax[0]} {
    padding: 0;
    gap: 0;
  }
`;

export function Chunk({ innerRef, chunk, page }: Props) {
  const [commerce, setCommerce] = useState<Advertise>();

  const showCommerce = page % 3 === 0;
  const showUserRecommendation = page % 2 === 1;
  const showProjectRecommendation = page % 2 === 0;

  const fetchCommerce = async (signal: AbortController) => {
    const data = await client.advertise(signal);
    setCommerce(data?.advertise);
  };

  useEffect(() => {
    const signal = new AbortController();

    if (commerce) return;
    if (!showCommerce) return;

    fetchCommerce(signal);
    return () => signal.abort();
  }, []);

  return (
    <Container ref={innerRef}>
      {/* tasks */}
      {chunk.tasks?.map((task) => (
        <Block key={task.id}>
          <Task
            id={task.id}
            title={task.title}
            content={task.description}
            author={task.owner.name}
            projectTitle={task.project.title}
            projectId={task.project.id}
            milestoneTitle={task.milestone.subject}
            milestoneId={task.milestone.id}
            taskGroupTitle={task.task_group.title}
            taskGroupId={task.task_group.id}
            created_at={task.created_at}
            author_profile={task.owner.profile_image_link ?? '/profile.jpg'}
          />
        </Block>
      ))}
      {/* projects : 홀수 chunk 마다 프로젝트 추천 노출*/}
      {showProjectRecommendation ? (
        <Block
          hasTitle={true}
          title="프로젝트"
          showChevron={true}
          href="/projects"
        >
          <Carousel>
            {chunk.projects?.map((project) => (
              <Project
                key={project.id}
                projectTitle={project.title}
                projectId={project.id}
                status={project.status}
                thumbnail={project.thumbnail_image}
                short_description={project.short_description}
              />
            ))}
          </Carousel>
        </Block>
      ) : (
        <></>
      )}
      {/* commercials : 3 chunk 마다 광고 노출 */}
      {!!commerce ? (
        <Commerce imageUrl={commerce?.file_link} href={commerce?.site_link} />
      ) : null}
      {/* users : 짝수 chunk 마다 유저 추천 노출*/}
      {showUserRecommendation ? (
        <Block
          hasTitle={true}
          title="사용자 추천"
          showChevron={true}
          href="/friends"
        >
          <Carousel>
            {chunk.users?.map((user) => (
              <User
                key={user.id}
                name={user.name}
                profile={user.profile_image_link}
                short_description={
                  user.short_description ?? '아직 소개가 없습니다.'
                }
                id={numberToString(user.id)}
              />
            ))}
          </Carousel>
        </Block>
      ) : (
        <></>
      )}
    </Container>
  );
}
