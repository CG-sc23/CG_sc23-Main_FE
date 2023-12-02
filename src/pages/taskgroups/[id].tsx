import styled from '@emotion/styled';
import { bpmax } from '@/libs/styles/constants';
import Card from '@/components/Card';
import { colors } from '@/components/constant/color';
import { css } from '@emotion/react';
import { FaPlus } from 'react-icons/fa6';
import Link from 'next/link';
import { Task } from '@/components/Projects/Task';
import { FaChevronRight } from 'react-icons/fa6';
import useGetTaskGroup from '@/hooks/taskGroup/useGetTaskGroup';
import LoadingSpinner from '@/components/Spinner';
import { taskCreationPermitted } from '@/libs/utils/task';

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 896px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* mobile */
  ${bpmax[0]} {
    width: 100%;
    padding: 0;
  }
`;

const Header = styled.h1`
  width: 100%;
  font-size: 2rem;
  font-weight: 500;
`;

const HR = styled.hr`
  width: 100%;
  color: gray;
  border: 1px solid ${colors.grey700};
`;

const TaskWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;

  ${bpmax[0]} {
    display: flex;
    flex-direction: column;
  }
`;

export default function TaskGroup() {
  const { taskGroup, isLoading } = useGetTaskGroup();

  return (
    <Container>
      {isLoading ? (
        <div
          css={css`
            width: 100%;
            height: 100%;

            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <Card>
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
              `}
            >
              <div
                css={css`
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                `}
              >
                <Header>{taskGroup?.title}</Header>
                {taskCreationPermitted(taskGroup?.permission) ? (
                  <Link
                    href={`/tasks/write/${taskGroup?.id}`}
                    css={css`
                      padding: 0.5rem;
                      border: 2px solid black;
                      border-radius: 0.2rem;
                      &:hover {
                        background-color: black;
                        color: white;
                      }
                    `}
                  >
                    <FaPlus size="20" />
                  </Link>
                ) : (
                  <></>
                )}
              </div>
              <div
                css={css`
                  display: flex;
                  gap: 0.5rem;
                `}
              >
                <Link href={`/projects/${taskGroup?.project?.id}`}>
                  {taskGroup?.project?.title}
                </Link>
                <FaChevronRight />
                <Link href={`/milestones/${taskGroup?.milestone?.id}`}>
                  {taskGroup?.milestone?.subject}
                </Link>
              </div>
            </div>

            <HR />
            <TaskWrapper>
              {taskGroup?.tasks?.map((task) => (
                <Task
                  title={task.title}
                  id={task.id}
                  created_at={task.created_at!}
                  tags={task.tags as string[]}
                />
              ))}
            </TaskWrapper>
          </Card>
        </>
      )}
    </Container>
  );
}
