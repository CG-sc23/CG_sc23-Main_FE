import { bpmax, bpmin } from '@/libs/styles/constants';
import { css } from '@emotion/react';
import Link from 'next/link';
import { colors } from '../constant/color';
import { FaChevronRight } from 'react-icons/fa6';
import { MouseEvent, MouseEventHandler } from 'react';
import { useRouter } from 'next/router';

type Props = {
  title: string;
  content: string;
  author: string;
  author_profile: string;
  id: number;
  projectTitle: string;
  projectId: number;
  milestoneTitle: string;
  milestoneId: number;
  taskGroupTitle: string;
  taskGroupId: number;
  created_at: string;
};

export function Task({
  title,
  content,
  author,
  author_profile,
  id,
  created_at,
  projectTitle,
  projectId,
  milestoneTitle,
  milestoneId,
  taskGroupTitle,
  taskGroupId,
}: Props) {
  const router = useRouter();
  const linkToTask = (e: MouseEvent<HTMLElement>) => {
    router.push(`/tasks/${id}`);
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
        /* mobile */
        ${bpmax[0]} {
          padding: 1rem;
          box-shadow: 2px 2px 4px ${colors.grey400};
        }
        &:hover {
          cursor: pointer;
        }
      `}
      onClick={linkToTask}
    >
      {/* autor, author_profile, created_at */}
      <div
        css={css`
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        `}
      >
        <img
          src={author_profile}
          alt={author}
          css={css`
            width: 3rem;
            height: 3rem;
            object-fit: contain;
          `}
        />
        <h3
          css={css`
            display: flex;
            font-weight: 600;
          `}
        >
          {author}
        </h3>
      </div>
      {/* title */}
      <h2
        css={css`
          font-size: 1.4rem;
          font-weight: 500;
        `}
      >
        {title}
      </h2>
      {/* project > milestone > taskgroup */}
      <div
        css={css`
          display: flex;
          gap: 0.5rem;
          align-items: center;
          font-size: 0.8rem;
          z-index: 10;
        `}
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        {/* TODO : link for each must be altered */}
        <Link href={`/projects/${projectId}`}>{projectTitle}</Link>
        <FaChevronRight size={14} />
        <Link href={`/milestones/${milestoneId}`}>{milestoneTitle}</Link>
        <FaChevronRight size={14} />
        <Link href={`/tasks/${taskGroupId}`}>{taskGroupTitle}</Link>
      </div>
      {/* created_at */}
      <span
        css={css`
          display: flex;
          font-size: 0.8rem;
          color: ${colors.grey600};
        `}
      >
        {created_at}
      </span>
    </div>
  );
}
