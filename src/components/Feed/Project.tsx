import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { colors } from '../constant/color';
import { bpmax, bpmin } from '@/libs/styles/constants';
import Link from 'next/link';
import { myProjectStatus } from '@/libs/utils/project';
import { IoIosHeartEmpty } from 'react-icons/io';

type Props = {
  projectTitle: string;
  projectId: number;
  status: string;
  thumbnail: string;
  short_description: string;
};

const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 16rem;
  padding: 1rem;
  border-radius: 0.2rem;
  border: 0.1rem solid ${colors.grey200};
  gap: 1rem;

  /* mobile */
  ${bpmin[0]} {
    &:hover {
      background-color: ${colors.grey800};
      color: white;
      cursor: pointer;
    }
  }

  /* web */
  ${bpmax[0]} {
    margin-bottom: 4px;
    margin-right: 4px;
    box-shadow: 2px 2px 4px ${colors.grey400};
  }
`;

const HR = styled.hr`
  width: 100%;
  border: 0.5px solid ${colors.grey300};
`;

export function Project({
  projectTitle,
  projectId,
  status,
  thumbnail,
  short_description,
}: Props) {
  return (
    <Container href={`/projects/${projectId}`}>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 1rem;
        `}
      >
        {/* thumbnail */}
        <img
          src={thumbnail}
          css={css`
            width: 100%;
            object-fit: contain;
          `}
        />
        {/* projectTitle */}
        <h1
          css={css`
            font-size: 1.2rem;
            font-weight: 500;
            word-break: ${projectTitle.indexOf(' ') > 12 ||
            projectTitle.indexOf(' ') == -1
              ? 'break-all'
              : 'keep-all'};
            text-align: center;
            line-height: 1.4;
          `}
        >
          {projectTitle}
        </h1>
        {/* shortDescriptions */}
        <p>{short_description}</p>
      </div>
      {/* status, likes */}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 0.5rem;
        `}
      >
        <HR />
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
              font-weight: 500;
              color: ${myProjectStatus(status as any).color};
            `}
          >
            {myProjectStatus(status as any).text}
          </span>
        </div>
      </div>
    </Container>
  );
}
