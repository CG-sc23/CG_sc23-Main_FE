import styled from '@emotion/styled';
import { bpmax, bpmin } from '@/libs/styles/constants';
import Card from '@/components/Card';
import { MilestoneData } from '@/libs/constant/test';
import { css } from '@emotion/react';
import { colors } from '@/components/constant/color';
import { TaskGroup } from '@/components/Projects/TaskGroup';
import { taskgroupCreationPermitted } from '@/libs/utils/taskgroup';
import { myProjectStatus } from '@/libs/utils/project';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { KeyboardEvent, MouseEvent, useState } from 'react';
import { formatDate } from '@/libs/utils';

const Container = styled.div`
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
  font-size: 2rem;
  font-weight: 600;
`;

const SubHeader = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
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
type Milestone = {
  milestone_id: number;
  project: {
    id: number;
    title: string;
    thumbnail_image: string | null;
  };
  created_by: {
    id: number;
    name: string;
  };
  subject: string;
  tags: string[] | null;
  status: string;
  created_at: string;
  due_date: string;
  task_groups: {
    id: number;
    title: string;
    status: string;
    created_at: string;
    due_date: string;
    tasks: {
      id: number;
      title: string;
    }[];
  }[];
  permission: string;
};

const milestone: Milestone = MilestoneData;

export default function MilestoneDetail() {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');

  const handleTagDelete = (e: MouseEvent<HTMLElement>) => {
    const targetIndex = tags.findIndex(
      (tag) => tag === e.currentTarget.innerHTML,
    );

    const updatedList = tags
      .slice(0, targetIndex)
      .concat(tags.slice(targetIndex + 1));

    setTags(updatedList);
  };

  return (
    <Container>
      {/* subject, thumbnail, status, created_at, due_date */}
      <Card>
        {/* subject */}
        <Header>{milestone.subject}</Header>
        {/* thumbnail (project) */}
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          <img
            src={milestone.project.thumbnail_image ?? '/project.jpg'}
            alt={milestone.subject}
            css={css`
              width: 12rem;
              height: 12rem;
              object-fit: contain;
            `}
          />
        </div>

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
              color: ${myProjectStatus(milestone?.status as any, '마일스톤')
                .color};
            `}
          >
            {myProjectStatus(milestone?.status as any, '마일스톤').text}
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
          <span>{formatDate(milestone.created_at)}</span>
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
          <span>{formatDate(milestone.due_date)}</span>
        </div>
      </Card>
      {/* task create */}
      {taskgroupCreationPermitted(milestone?.permission) ? (
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
              required
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
              required
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
            >
              생성
            </button>
          </div>
        </Card>
      ) : (
        <></>
      )}
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
          {milestone.task_groups.map((task_group) => (
            <TaskGroup
              id={task_group.id}
              title={task_group.title}
              status={task_group.status}
              created_at={task_group.created_at}
              due_date={task_group.due_date}
            />
          ))}
        </div>
      </Card>
    </Container>
  );
}
