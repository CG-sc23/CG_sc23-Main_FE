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

const Container = styled(Link)`
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

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;

  text-overflow: clip;

  height: 3rem;
`;
const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const Status = styled.span`
  color: ${(props) => props.color};
  font-weight: 500;
`;
const Div = styled.span`
  display: block;
  width: 1px;
  height: 100%;
  background-color: ${colors.grey500};
`;
const DDay = styled.span<{ sign: 'PLUS' | 'MINUS' }>`
  color: ${(props) =>
    props.sign === 'PLUS' ? colors.yellow500 : colors.green500};
`;
const ProjectThumbnailWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  ${bpmax[0]} {
    display: none;
  }
`;
const ShortDescription = styled.div`
  line-height: 1.6;
  flex: 1;
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
    <Container key={`PROJECT_${project.id}`} href={`/projects/${project.id}`}>
      <Title>{project.title}</Title>
      <Info>
        <Status color={projectStatus.color}>{projectStatus.text}</Status>
        <Div />
        <DDay sign={dDay.sign}>
          D{dDay.sign === 'PLUS' ? '+' : '-'}
          {dDay.day}
        </DDay>
      </Info>
      <ProjectThumbnailWrapper>
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
      </ProjectThumbnailWrapper>
      <ShortDescription>{project.short_description}</ShortDescription>
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
    </Container>
  );
}
