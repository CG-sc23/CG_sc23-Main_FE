import styled from "@emotion/styled";
import { bpmax } from "@/libs/styles/constants";
import Card from "@/components/Card";
import { TaskGroupData } from "@/libs/constant/test";
import { colors } from "@/components/constant/color";
import { css } from "@emotion/react";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import { Task } from "@/components/Projects/Task";
import { FaChevronRight } from "react-icons/fa6";

const Container = styled.div`
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

type TaskGroup = {
  task_group_id: number;
  project: {
    id: number;
    title: string;
  };
  milestone: {
    id: number;
    subject: string;
  };
  created_by: {
    id: number;
    name: string;
  };
  title: string;
  status: string;
  due_date: string;
  created_at: string;
  permission: string;
  tasks: {
    id: number;
    title: string;
    created_at: string;
    tags: string[];
  }[];
};

const taskGroup: TaskGroup = TaskGroupData;

export default function TaskGroup() {
  return (
    <Container>
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
            <Header>{taskGroup.title}</Header>
            <Link
              href="/tasks/write"
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
          </div>
          <div
            css={css`
              display: flex;
              gap: 0.5rem;
            `}
          >
            <Link href={`/projects/${taskGroup.project.id}`}>
              {taskGroup.project.title}
            </Link>
            <FaChevronRight />
            <Link href={`/milestones/${taskGroup.milestone.id}`}>
              {taskGroup.milestone.subject}
            </Link>
          </div>
        </div>

        <HR />
        <TaskWrapper>
          {taskGroup.tasks.map((task) => (
            <Task
              title={task.title}
              id={task.id}
              created_at={task.created_at}
              tags={task.tags}
            />
          ))}
        </TaskWrapper>
      </Card>
    </Container>
  );
}
