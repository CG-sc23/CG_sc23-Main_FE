import { ForwardedRef, ReactNode } from 'react';
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
      {/* projects */}
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
      {/* commercials */}
      {page % 3 === 0 ? <Commerce imageUrl={undefined} /> : <></>}
      {/* users */}
      {page % 2 === 0 ? (
        <Block
          hasTitle={true}
          title="사용자 추천"
          showChevron={true}
          href="/users"
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
