import { bpmax, bpmin } from '@/libs/styles/constants';
import styled from '@emotion/styled';
import Link from 'next/link';
import { colors } from '../constant/color';
import { MouseEvent, useState } from 'react';
import { css } from '@emotion/react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa6';
import { myProjectStatus } from '@/libs/utils/project';
import { formatDate } from '@/libs/utils';
import ConditionalRendering from '../ConditionalRendering';

// [Layer] Project > Milestone > Task Group > Task
// TODO : TaskGroup UI

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  border-top: 2px solid ${colors.grey200};
  /* mobile */
  ${bpmax[0]} {
    padding: 1rem 0.2rem;
  }
  /* web */
  ${bpmin[0]} {
    padding: 1rem;
  }
`;

const Header = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
`;

const TaskWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 1rem;
`;

const TaskContentBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const SubHeader = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
`;

const Button = styled(Link)`
  width: 100%;
  font-size: 1.2rem;
  padding: 0.8rem;
  box-sizing: border-box;
  border-radius: 0.2rem;
  background-color: ${colors.grey400};
  text-align: center;
  color: white;
  ${bpmin[0]} {
    &:hover {
      background-color: black;
      cursor: pointer;
    }
  }
`;

const DeleteButton = styled.button<{
  hoverColor?: string;
  disabledColor?: string;
}>`
  background-color: ${(props) => props.color || colors.red600};

  width: 100%;
  font-size: 1.2rem;
  font-weight: 500;

  border-radius: 0.2rem;
  text-align: center;

  padding: 0.5rem 1rem;

  color: ${colors.white};

  cursor: pointer;

  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${(props) => props.hoverColor || colors.red400};
  }
  &:disabled {
    background-color: ${(props) => props.disabledColor || colors.blue200};
    cursor: not-allowed;
  }
`;
type Props = {
  id: number;
  title: string;
  status: string;
  created_at: string;
  due_date: string;
  hasDeleteButton?: boolean;
  onDelete?: () => Promise<void>;
};

export function TaskGroup({
  id,
  title,
  status,
  created_at,
  due_date,
  hasDeleteButton = false,
  onDelete,
}: Props) {
  const [showTasks, setShowTasks] = useState(false);

  const handleShowTasks = (e: MouseEvent<HTMLButtonElement>) => {
    setShowTasks((prev) => !prev);
  };

  return (
    <Container>
      {/* title */}
      <button
        onClick={handleShowTasks}
        css={css`
          display: flex;
          justify-content: space-between;
          width: 100%;
          &:hover {
            cursor: pointer;
          }
        `}
      >
        <Header>{title}</Header>
        {showTasks ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {/* status, created_at, due_date, tasks */}
      {showTasks ? (
        <TaskWrapper>
          <TaskContentBox>
            <SubHeader>상태</SubHeader>
            <span
              css={css`
                color: ${myProjectStatus(status as any).color};
              `}
            >
              {myProjectStatus(status as any).text}
            </span>
          </TaskContentBox>
          <TaskContentBox>
            <SubHeader>시작일</SubHeader>
            <span>{formatDate(created_at)}</span>
          </TaskContentBox>
          <TaskContentBox>
            <SubHeader>종료일</SubHeader>
            <span>{formatDate(due_date)}</span>
          </TaskContentBox>
          <Button href={`/taskgroups/${id}`}>상세보기</Button>
          <ConditionalRendering condition={hasDeleteButton}>
            <DeleteButton onClick={onDelete}>삭제</DeleteButton>
          </ConditionalRendering>
        </TaskWrapper>
      ) : null}
    </Container>
  );
}
