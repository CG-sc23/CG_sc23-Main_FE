// [Layer] Project > Milestone > Task Group > Task

import styled from '@emotion/styled';
import { colors } from '../constant/color';
import Link from 'next/link';
import { bpmax, bpmin } from '@/libs/styles/constants';
import { useState } from 'react';
import { css } from '@emotion/react';
import { calculateDDay, myProjectStatus } from '@/libs/utils/project';
import Image from 'next/image';
import { Project } from '@/libs/type/client';

const MEMBER_LIMIT = 5;
const OVERLAP_NUMBER = 25;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  gap: 1rem;

  width: 100%;
  padding: 1rem 0;
  border-top: 1px solid ${colors.grey300};

  &:first-of-type {
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

const ThumbnailGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const MemberThumbnailWrapper = styled.div<{ index: number; length: number }>`
  position: relative;

  width: 3rem;
  height: 3rem;

  border-radius: 9999px;
  overflow: hidden;

  display: flex;
  display: ${(props) => (props.index < MEMBER_LIMIT + 1 ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;

  right: ${(props) => {
    const LIMIT = Math.min(props.length, MEMBER_LIMIT);
    const isMore = props.index === MEMBER_LIMIT;
    const isLast = props.length - 1 === props.index;

    return isMore || isLast
      ? '0px'
      : `${-OVERLAP_NUMBER * (LIMIT - props.index) + OVERLAP_NUMBER}px`;
  }};
  z-index: ${(props) => `${props.length - props.index}`};
`;
const More = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: bold;

  border-radius: 9999px;
  background-color: ${colors.white};
  border: 1px solid ${colors.grey300};
`;

type Props = { project: Project };
export default function Project({ project }: Props) {
  const dDay = calculateDDay(project.created_at, project.due_date);
  const projectStatus = myProjectStatus(project.status);

  return (
    <Card key={`PROJECT_${project.id}`} href={`/projects/${project.id}`}>
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
            color: ${projectStatus.color};
            font-weight: 500;
          `}
        >
          {projectStatus.text}
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
            color: ${dDay.sign === 'PLUS' ? colors.yellow500 : colors.green500};
          `}
        >
          D{dDay.sign === 'PLUS' ? '+' : '-'}
          {dDay.day}
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
          src={project.thumbnail_image ?? '/project.jpg'}
          alt={project.title}
          width={192}
          height={192}
          priority
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
      {/* member's profiles */}
      <ThumbnailGroup>
        {project.members.map((member, idx, origin) => (
          <MemberThumbnailWrapper
            key={`${project.id}_${member.email}`}
            index={idx}
            length={origin.length}
          >
            {idx < MEMBER_LIMIT ? (
              <Image
                src={
                  member?.profile_image_link && member?.profile_image_updated_at
                    ? `${member?.profile_image_link}?timestamp=${member?.profile_image_updated_at}`
                    : '/profile.jpg'
                }
                alt={member.name}
                fill
                sizes="(max-width: 768px) 100px, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <More>+ {origin.length - MEMBER_LIMIT}</More>
            )}
          </MemberThumbnailWrapper>
        ))}
      </ThumbnailGroup>
    </Card>
  );
}
