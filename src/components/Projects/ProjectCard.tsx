// [Layer] Project > Milestone > Task Group > Task

import styled from '@emotion/styled';
import { colors } from '../constant/color';
import Link from 'next/link';
import { bpmax, bpmin } from '@/libs/styles/constants';
import { useState } from 'react';
import { css } from '@emotion/react';
import { myProjectStatus } from '@/libs/utils/project';
import Image from 'next/image';

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  gap: 1rem;

  width: 100%;
  padding: 1rem 0;
  border-top: 1px solid ${colors.grey300};

  &:first-child {
    border: none;
  }

  ${bpmin[0]} {
    padding: 1rem;
    border: none;
    border-radius: 0.2rem;
    box-shadow: 2px 2px 4px ${colors.grey400};
    background-color: white;
    transition: 0.5s;

    &:hover {
      background-color: ${colors.grey800};
      transform: scale(1.04);
      color: white;
    }
  }
`;

type Props = { id: number };

type Project = {
  title: string;
  owner: string;
  short_description: string;
  status: string;
  due_date: string;
  thumbnail: string | null;
  meta_tag: string[];
} | null;

// TODO : Erase this object as soon as implementation is finished
const initialProject = {
  title: '무제',
  owner: '임준혁',
  short_description:
    '프로젝트 테스트 문구입니다. 확인부탁드립니다. 간단한 설명을 담고 있는 short - description 문장입니다.',
  status: 'in_progress',
  due_date: '2023.11.18',
  thumbnail: null,
  meta_tag: ['figma', 'react', 'svelte'],
};

export default function Project({ id }: Props) {
  // TODO : project ID를 통해 Project data fetching 해와 보여주기
  const [project, setProject] = useState(initialProject);

  return (
    <Card key={id} href={`/Projects/${id}`}>
      {/* title */}
      <h1
        css={css`
          font-size: 1.5rem;
          font-weight: 600;
        `}
      >
        {project.title}
      </h1>
      {/* status, due_date */}
      <div
        css={css`
          display: flex;
          align-items: center;
          gap: 0.5rem;
        `}
      >
        <span
          css={css`
            color: ${myProjectStatus(project.status).color};
            font-weight: 500;
          `}
        >
          {myProjectStatus(project.status).text}
        </span>
        <span
          css={css`
            display: block;
            width: 1px;
            height: 100%;
            background-color: ${colors.grey500};
          `}
        />
        <span
          css={css`
            color: ${colors.grey500};
          `}
        >
          {project.due_date}
        </span>
      </div>
      {/* thumbnail image - only for mobile */}
      <div
        css={css`
          display: flex;
          width: 100%;
          justify-content: center;
          ${bpmax[0]} {
            display: none;
          }
        `}
      >
        <Image
          src={project.thumbnail ?? '/project.jpg'}
          alt={project.title}
          width={192}
          height={192}
          css={css`
            border-radius: 1rem;
          `}
        />
      </div>
      {/* short_descriptions */}
      <p
        css={css`
          line-height: 1.6;
        `}
      >
        {project.short_description}
      </p>
      {/* owner, meta tag */}
      {/* TODO : fetch each tag image */}
      <div
        css={css`
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          width: 100%;
        `}
      >
        {project.meta_tag.map((tag) => (
          <img
            src={'/github.png'}
            alt={tag}
            css={css`
              width: 2rem;
            `}
          />
        ))}
      </div>
    </Card>
  );
}
