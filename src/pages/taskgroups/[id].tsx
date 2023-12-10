import styled from '@emotion/styled';
import { bpmax, bpmin } from '@/libs/styles/constants';
import Card from '@/components/Card';
import { colors } from '@/components/constant/color';
import { css } from '@emotion/react';
import { FaPlus } from 'react-icons/fa6';
import Link from 'next/link';
import { Task } from '@/components/Projects/Task';
import { FaChevronRight } from 'react-icons/fa6';
import useGetTaskGroup from '@/hooks/taskGroup/useGetTaskGroup';
import { taskCreationPermitted } from '@/libs/utils/task';
import CustomSuspense from '@/components/CustomSuspense';
import ConditionalRendering from '@/components/ConditionalRendering';
import { Dispatch, SetStateAction, useState } from 'react';
import { myTaskGroupStatus } from '@/libs/utils/project';

import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import ReactDatePicker from 'react-datepicker';
import { TaskGroupStatus } from '@/libs/type/client';
import { safeLocalStorage } from '@toss/storage';
import { queryKey } from '@/libs/constant';
import client from '@/api/client';
import useSnackBar from '@/hooks/useSnackBar';
import { formatDate } from '@/libs/utils';

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
const SubHeader = styled.h3`
  font-size: 1.2rem;
  font-weight: 500;
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
const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
const Button = styled.button<{ hoverColor?: string; disabledColor?: string }>`
  background-color: ${(props) => props.color || colors.blue600};

  font-size: 1.2rem;
  font-weight: 500;

  border-radius: 0.2rem;
  text-align: center;

  padding: 0.5rem 1rem;

  color: ${colors.white};

  cursor: pointer;

  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${(props) => props.hoverColor || colors.blue400};
  }
  &:disabled {
    background-color: ${(props) => props.disabledColor || colors.blue200};
    cursor: not-allowed;
  }
`;

export default function TaskGroup() {
  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
  const { taskGroup, isLoading, refetch } = useGetTaskGroup();
  const { openSnackBar } = useSnackBar();

  // TODO Toggle Menu
  const [toggleAdminMenu, setToggleAdminMenu] = useState('00');
  const getToggleState = (toggle: string) => (idx: number) =>
    toggle.at(idx) === '1';
  const updateToggle = (toggle: string) => (idx: number) => {
    if (toggle.at(idx) === '1') {
      return toggle.slice(0, idx) + '0' + toggle.slice(idx + 1);
    } else {
      const updated = '0'.repeat(toggle.length);

      return updated.slice(0, idx) + '1' + updated.slice(idx + 1);
    }
  };
  const toggleUpdateHandler =
    (toggle: string, setter: Dispatch<SetStateAction<string>>) =>
    (idx: number) =>
    () =>
      setter(updateToggle(toggle)(idx));

  // TODO Admin 1. Change TaskGroup's Status
  const [statusLoading, setStatusLoading] = useState(false);
  const onStatus = async (status: TaskGroupStatus) => {
    if (!token) return;
    if (statusLoading) return;
    if (!taskGroup?.id) return;
    if (status === taskGroup?.status) return;

    setStatusLoading(true);

    const res = await client
      .modifyTaskGroup({
        token,
        task_group_id: taskGroup?.id + '',
        body: {
          status,
        },
      })
      .finally(() => setStatusLoading(false));

    if (res?.ok) refetch();
    else openSnackBar('요청이 실패하였습니다.');
  };
  // TODO Admin 2. Modify TaskGroup
  const [updatedTaskGroup, setUpdatedTaskGroup] = useState('');
  const [updatedTaskGroupDueDate, setUpdatedTaskGroupDueDate] = useState(
    new Date(),
  );
  const [updatedTaskGroupLoading, setUpdatedTaskGroupLoading] = useState(false);

  return (
    <Container>
      <CustomSuspense isLoading={isLoading}>
        <>
          <ConditionalRendering
            condition={taskCreationPermitted(taskGroup?.permission)}
          >
            <Card
              css={css`
                position: relative;
              `}
            >
              <Header>관리자 메뉴</Header>
              <ButtonBox>
                <Button
                  onClick={toggleUpdateHandler(
                    toggleAdminMenu,
                    setToggleAdminMenu,
                  )(0)}
                >
                  태스크 그룹 상태 변경
                </Button>
                <Button
                  onClick={() => {
                    toggleUpdateHandler(
                      toggleAdminMenu,
                      setToggleAdminMenu,
                    )(1)();

                    setUpdatedTaskGroup(taskGroup?.title!);
                    setUpdatedTaskGroupDueDate(new Date(taskGroup?.due_date!));
                  }}
                >
                  태스크 그룹 수정
                </Button>
              </ButtonBox>
              <ConditionalRendering
                condition={toggleAdminMenu.includes('1')}
                isAnimate
              >
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: 'auto',
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  css={css`
                    box-sizing: border-box;
                    overflow: visible;
                  `}
                >
                  <ConditionalRendering
                    condition={getToggleState(toggleAdminMenu)(0)}
                  >
                    <motion.div
                      key="status"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      css={css`
                        width: 100%;
                        position: relative;
                        display: flex;
                        gap: 5px;
                      `}
                    >
                      <Button
                        css={css`
                          padding: 0.5rem 1.5rem;
                          background-color: ${colors.blue400};
                          &:hover {
                            background-color: ${colors.blue200};
                          }
                        `}
                        onClick={() => onStatus('READY')}
                      >
                        시작 대기
                      </Button>
                      <Button
                        css={css`
                          padding: 0.5rem 1.5rem;
                          background-color: ${colors.green400};
                          &:hover {
                            background-color: ${colors.green200};
                          }
                        `}
                        onClick={() => onStatus('IN_PROGRESS')}
                      >
                        진행 중
                      </Button>
                      <Button
                        css={css`
                          padding: 0.5rem 1.5rem;
                          background-color: ${colors.yellow400};
                          &:hover {
                            background-color: ${colors.yellow200};
                          }
                        `}
                        onClick={() => onStatus('COMPLETED')}
                      >
                        완료
                      </Button>
                    </motion.div>
                  </ConditionalRendering>

                  <ConditionalRendering
                    condition={getToggleState(toggleAdminMenu)(1)}
                  >
                    <motion.div
                      key="modify"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      css={css`
                        width: 100%;
                      `}
                    >
                      <div
                        css={css`
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                        `}
                      >
                        <Header>태스크 그룹 수정</Header>
                      </div>
                      <div
                        css={css`
                          display: flex;
                          flex-direction: column;
                          gap: 1rem;
                          margin-top: 1rem;
                        `}
                      >
                        <input
                          id="title"
                          css={css`
                            width: 100%;
                            padding: 0.8rem;
                            border: 1px solid ${colors.grey200};
                            border-radius: 0.2rem;
                            font-size: 1.2rem;
                            box-sizing: border-box;
                            &:focus {
                              outline: none;
                              border: 1px solid black;
                            }
                          `}
                          placeholder="새로운 태스크그룹 입력"
                          value={updatedTaskGroup}
                          onChange={(e) => setUpdatedTaskGroup(e.target.value)}
                        />
                        <ReactDatePicker
                          dateFormat="yyyy.MM.dd"
                          shouldCloseOnSelect
                          minDate={new Date()}
                          selected={updatedTaskGroupDueDate}
                          onChange={(date) => {
                            setUpdatedTaskGroupDueDate(date ?? new Date());
                          }}
                          css={css`
                            width: 100%;
                            padding: 0.8rem;
                            box-sizing: border-box;
                            outline: none;
                            border: 1px solid ${colors.grey200};
                            font-size: 1.2rem;
                            border-radius: 0.2rem;
                            &:focus {
                              border: 1px solid black;
                            }
                          `}
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (updatedTaskGroupLoading) return;
                            if (!token) return;
                            if (!taskGroup?.id) return;

                            setUpdatedTaskGroupLoading(true);

                            const res = await client
                              .modifyTaskGroup({
                                token,
                                task_group_id: taskGroup?.id + '',
                                body: {
                                  due_date:
                                    updatedTaskGroupDueDate.toISOString(),
                                  title: updatedTaskGroup,
                                },
                              })
                              .finally(() => setUpdatedTaskGroupLoading(false));

                            if (res?.ok) {
                              refetch();
                            } else openSnackBar('요청에 실패하였습니다.');
                            setUpdatedTaskGroup('');
                          }}
                          css={css`
                            width: 100%;
                            font-size: 1.2rem;
                            padding: 0.6rem;
                            border-radius: 0.2rem;
                            background-color: ${colors.grey400};
                            color: white;
                            ${bpmin[0]} {
                              &:hover {
                                background-color: black;
                                cursor: pointer;
                              }
                            }
                          `}
                          disabled={updatedTaskGroupLoading}
                        >
                          {updatedTaskGroupLoading ? '로딩 중' : '수정'}
                        </button>
                      </div>
                    </motion.div>
                  </ConditionalRendering>
                </motion.div>
              </ConditionalRendering>
            </Card>
          </ConditionalRendering>
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
                ) : null}
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

                <span
                  css={css`
                    color: ${myTaskGroupStatus(taskGroup?.status!)?.color ||
                    'black'};
                  `}
                >
                  {myTaskGroupStatus(taskGroup?.status as any)?.text}
                </span>
              </div>
            </div>
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: 10px;

                span {
                  color: ${colors.grey500};
                }
              `}
            >
              <SubHeader>종료일</SubHeader>
              <span>{formatDate(taskGroup?.due_date!)}</span>
            </div>
            <HR />
            <TaskWrapper>
              {taskGroup?.tasks?.map((task) => (
                <Task
                  key={`TASK_${taskGroup.id}_${task.id}`}
                  title={task.title}
                  id={task.id}
                  created_at={task.created_at!}
                  tags={task.tags as string[]}
                />
              ))}
            </TaskWrapper>
          </Card>
        </>
      </CustomSuspense>
    </Container>
  );
}
