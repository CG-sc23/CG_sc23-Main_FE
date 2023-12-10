import styled from '@emotion/styled';
import { bpmax, bpmin } from '@/libs/styles/constants';
import Card from '@/components/Card';
import { css } from '@emotion/react';
import { colors } from '@/components/constant/color';
import { TaskGroup } from '@/components/Projects/TaskGroup';
import { taskgroupCreationPermitted } from '@/libs/utils/taskgroup';
import { myMileStoneStatus, myProjectStatus } from '@/libs/utils/project';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { useState, useMemo, Dispatch, SetStateAction, MouseEvent } from 'react';
import { formatDate } from '@/libs/utils';
import useGetMileStone from '@/hooks/milestone/useGetMileStone';
import { safeLocalStorage } from '@toss/storage';
import { queryKey } from '@/libs/constant';
import useSnackBar from '@/hooks/useSnackBar';
import client from '@/api/client';
import ConditionalRendering from '@/components/ConditionalRendering';
import CustomSuspense from '@/components/CustomSuspense';

import { motion } from 'framer-motion';
import { MilestoneStatus } from '@/libs/type/client';

const Container = styled.div`
  width: 896px;
  height: 100%;

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
  font-size: 2rem;
  font-weight: 600;
`;

const SubHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const ChartWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 16rem;

  ${bpmax[0]} {
    height: 12rem;
  }
`;

const ChartFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14rem;
  height: 14rem;
  border-radius: 9999rem;
  background-color: black;
  color: white;
  font-weight: 500;
  font-size: 1.2rem;
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
const TagWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 0.2rem;
  background-color: ${colors.grey300};
  color: black;
`;
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function MilestoneDetail() {
  const { milestone, isLoading, refetch } = useGetMileStone();

  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
  const { openSnackBar } = useSnackBar();
  const [createTaskGroupLoading, setCreateTaskGroupLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date>(new Date());

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

  // TODO Admin 1. Change Milestone's Status
  const [statusLoading, setStatusLoading] = useState(false);
  const onStatus = async (status: MilestoneStatus) => {
    if (!token) return;
    if (statusLoading) return;
    if (!milestone?.id) return;
    if (status === milestone?.status) return;

    setStatusLoading(true);

    const res = await client
      .modifyMilestone({
        token,
        milestone_id: milestone?.id + '',
        body: {
          status,
        },
      })
      .finally(() => setStatusLoading(false));

    if (res?.ok) refetch();
    else openSnackBar('요청이 실패하였습니다.');
  };

  // TODO Admin 2. Modify Milestone
  const [updatedMilestone, setUpdatedMilestone] = useState('');
  const [updatedMilestoneDueDate, setUpdatedMilestoneDueDate] = useState(
    new Date(),
  );
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');
  const [updatedMileStoneLoading, setUpdatedMileStoneLoading] = useState(false);
  const handleTagDelete = (e: MouseEvent<HTMLElement>) => {
    const targetIndex = tags.findIndex(
      (tag) => tag === e.currentTarget.innerHTML,
    );

    const updatedList = tags
      .slice(0, targetIndex)
      .concat(tags.slice(targetIndex + 1));

    setTags(updatedList);
  };

  const [deletedLoading, setDeletedLoading] = useState(false);
  const getOnDelete = (id: number) => async () => {
    if (deletedLoading) return;
    if (!token) return;
    setDeletedLoading(true);

    const res = await client
      .deleteTaskGroupInfo({
        task_group_id: id + '',
        token,
      })
      .finally(() => setDeletedLoading(false));

    if (res?.ok) {
      openSnackBar('요청에 성공하였습니다.');
      refetch();
    } else openSnackBar('요청에 실패하였습니다.');
  };

  const isChartAvailable = useMemo(() => {
    if (!!milestone?.task_groups?.length) return true;
    else return false;
  }, [milestone]);

  const chartDataForMilestone = useMemo(() => {
    const totalTaskGroupCount = milestone?.task_groups?.length ?? 0;
    const finishedTaskGroupCount =
      milestone?.task_groups?.reduce((acc, cur) => {
        if (cur.status !== 'IN_PROGRESS') return acc + 1;
        else return acc;
      }, 0) ?? 0;
    const inprogressTaskGroupCount =
      totalTaskGroupCount - finishedTaskGroupCount;

    return {
      labels: ['종료된 태스크 그룹', '진행중인 태스크 그룹'],
      datasets: [
        {
          data: [finishedTaskGroupCount, inprogressTaskGroupCount],
          borderWidth: 1,
          backgroundColor: [colors.green600, colors.grey300],
          borderColor: ['white', 'white'],
        },
      ],
    };
  }, [milestone]);

  return (
    <Container>
      <CustomSuspense isLoading={isLoading && !milestone}>
        <>
          {/* subject, thumbnail, status, created_at, due_date */}
          <Card>
            {/* subject */}
            <Header>{milestone?.subject}</Header>
            {/* thumbnail (project) */}
            <ChartWrapper>
              <ConditionalRendering
                condition={isChartAvailable}
                fallback={() => (
                  <ChartFallback>아직 목표가 없습니다!</ChartFallback>
                )}
              >
                <Pie
                  data={chartDataForMilestone}
                  options={{
                    plugins: {
                      datalabels: {
                        formatter: (value, context) => {
                          return context.chart.data.labels?.at(
                            context.dataIndex,
                          );
                        },
                        color: colors.black,
                        font: {
                          weight: 'bold',
                          size: 12,
                        },
                      },
                    },
                  }}
                />
              </ConditionalRendering>
            </ChartWrapper>
            {/* status */}
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                margin-top: 1rem;
              `}
            >
              <span
                css={css`
                  font-size: 1.2rem;
                  font-weight: 500;
                `}
              >
                상태
              </span>
              <span
                css={css`
                  color: ${myMileStoneStatus(milestone?.status!)?.color ||
                  'black'};
                `}
              >
                {myProjectStatus(milestone?.status as any)?.text}
              </span>
            </div>
            {/* created_at */}
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
              `}
            >
              <span
                css={css`
                  font-size: 1.2rem;
                  font-weight: 500;
                `}
              >
                시작일
              </span>
              <span>{formatDate(milestone?.created_at!)}</span>
            </div>
            {/* due_date */}
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
              `}
            >
              <span
                css={css`
                  font-size: 1.2rem;
                  font-weight: 500;
                `}
              >
                종료일
              </span>
              <span>{formatDate(milestone?.due_date!)}</span>
            </div>
          </Card>
          <ConditionalRendering
            condition={taskgroupCreationPermitted(milestone?.permission)}
          >
            <Card style={{ position: 'relative' }}>
              <Header>관리자 메뉴</Header>
              <ButtonBox>
                <Button
                  onClick={toggleUpdateHandler(
                    toggleAdminMenu,
                    setToggleAdminMenu,
                  )(0)}
                >
                  마일스톤 상태 변경
                </Button>
                <Button
                  onClick={() => {
                    toggleUpdateHandler(
                      toggleAdminMenu,
                      setToggleAdminMenu,
                    )(1)();

                    setUpdatedMilestone(milestone?.subject!);
                    setTags(milestone?.tags as string[]);
                    setUpdatedMilestoneDueDate(new Date(milestone?.due_date!));
                  }}
                >
                  마일스톤 수정
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
                        position: relative;
                      `}
                    >
                      <div
                        css={css`
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                        `}
                      >
                        <Header>마일스톤 수정</Header>
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
                          placeholder="새로운 마일스톤명 입력"
                          value={updatedMilestone}
                          onChange={(e) => setUpdatedMilestone(e.target.value)}
                        />
                        <DatePicker
                          dateFormat="yyyy.MM.dd"
                          shouldCloseOnSelect
                          minDate={new Date()}
                          selected={updatedMilestoneDueDate}
                          onChange={(date) => {
                            setUpdatedMilestoneDueDate(date ?? new Date());
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
                        <input
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
                          placeholder="새로 태그 추가"
                          value={tag}
                          onChange={(e) => {
                            setTag(e.target.value);
                          }}
                          onKeyUp={(e) => {
                            if (e.code !== 'Enter') return;
                            if (tag === '') return;
                            e.preventDefault();
                            e.stopPropagation();

                            setTag('');
                            if (tags.includes(tag)) return;
                            setTags((prev) => [...prev, tag]);
                          }}
                        />
                        <TagWrapper>
                          {tags.map((tag) => (
                            <Tag
                              key={`TAGS_${tag}`}
                              onClick={handleTagDelete}
                              css={css`
                                &:hover {
                                  cursor: pointer;
                                }
                              `}
                            >
                              {tag}
                            </Tag>
                          ))}
                        </TagWrapper>
                        <button
                          type="button"
                          onClick={async () => {
                            if (updatedMileStoneLoading) return;
                            if (!token) return;
                            if (!milestone?.id) return;

                            setUpdatedMileStoneLoading(true);

                            const res = await client
                              .modifyMilestone({
                                token,
                                milestone_id: milestone?.id + '',
                                body: {
                                  due_date:
                                    updatedMilestoneDueDate.toISOString(),
                                  subject: updatedMilestone,
                                  tags: JSON.stringify(tags),
                                },
                              })
                              .finally(() => setUpdatedMileStoneLoading(false));

                            if (res?.ok) {
                              refetch();
                            } else openSnackBar('요청에 실패하였습니다.');
                            setUpdatedMilestone('');
                            setTag('');
                            setTags([]);
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
                          disabled={updatedMileStoneLoading}
                        >
                          {updatedMileStoneLoading ? '로딩 중' : '수정'}
                        </button>
                      </div>
                    </motion.div>
                  </ConditionalRendering>
                </motion.div>
              </ConditionalRendering>
            </Card>
          </ConditionalRendering>

          {/* task create */}
          <ConditionalRendering
            condition={taskgroupCreationPermitted(milestone?.permission)}
          >
            <Card
              css={css`
                ${bpmax[0]} {
                  padding-top: 2rem;
                  border-top: 0.3rem solid ${colors.grey300};
                }
              `}
            >
              <SubHeader>태스크 그룹 생성</SubHeader>
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
                  placeholder="새로운 태스크 그룹명 입력"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <DatePicker
                  dateFormat="yyyy.MM.dd"
                  shouldCloseOnSelect
                  minDate={new Date()}
                  selected={dueDate}
                  onChange={(date) => {
                    setDueDate(date ?? new Date());
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
                  onClick={async (e) => {
                    e.preventDefault();
                    if (createTaskGroupLoading) return;
                    if (!token) return;
                    if (!milestone?.id) return;

                    setCreateTaskGroupLoading(true);

                    const res = await client
                      .createTaskGroup({
                        token,
                        milestone_id: milestone?.id + '',
                        body: {
                          due_date: dueDate.toISOString(),
                          title: title,
                        },
                      })
                      .finally(() => setCreateTaskGroupLoading(false));

                    if (res?.ok) {
                      refetch();
                    } else openSnackBar('요청에 실패하였습니다.');
                    setTitle('');
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
                  disabled={createTaskGroupLoading}
                >
                  {createTaskGroupLoading ? '로딩중' : '생성'}
                </button>
              </div>
            </Card>
          </ConditionalRendering>

          {/* task_groups */}
          <Card
            css={css`
              ${bpmax[0]} {
                padding-top: 2rem;
                border-top: 0.3rem solid ${colors.grey300};
              }
            `}
          >
            {/* task_groups*/}
            <SubHeader>태스크 그룹 목록</SubHeader>
            <div
              css={css`
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                padding-bottom: 1rem;
              `}
            >
              {milestone?.task_groups?.map((task_group) => (
                <TaskGroup
                  key={`TASK_GROUP_${milestone.id}_${task_group.id}`}
                  id={task_group.id}
                  title={task_group.title}
                  status={task_group.status!}
                  created_at={task_group.created_at!}
                  due_date={task_group.due_date!}
                  hasDeleteButton={taskgroupCreationPermitted(
                    milestone.permission,
                  )}
                  onDelete={getOnDelete(task_group.id)}
                />
              ))}
            </div>
          </Card>
        </>
      </CustomSuspense>
    </Container>
  );
}
