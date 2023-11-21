import { css } from '@emotion/react';
import Image from 'next/image';
import { colors } from './constant/color';
import { GithubUpdateStatusResponse } from '@/libs/type/client';

type Props = {
  title: string;
  status: GithubUpdateStatusResponse['status'];
};
export default function GitHubSkeleton({ title, status }: Props) {
  const getStatusText = () => {
    if (status === 'COMPLETE') return 'GitHub 업데이트 완료!';
    if (status === 'IN_PROGRESS') return 'GitHub 이력을 불러오는 중 입니다!';
    return 'GitHub 주소가 없어요...!';
  };

  const getStatusBackgroundColor = () => {
    if (status === 'COMPLETE') return colors.green200;
    if (status === 'IN_PROGRESS') return colors.yellow200;
    return colors.grey200;
  };

  const getStatusBorderColor = () => {
    if (status === 'COMPLETE') return colors.green400;
    if (status === 'IN_PROGRESS') return colors.yellow400;
    return colors.grey400;
  };

  return (
    <>
      <h1
        css={css`
          font-size: 1.5rem;
          font-weight: bold;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid #e0e0e0;
        `}
      >
        {title}
      </h1>
      <div
        css={css`
          position: relative;
          min-height: 300px;
          width: 100%;
          margin-bottom: 1.5rem;

          display: flex;

          justify-content: center;
          align-items: center;

          gap: 10px;

          background-color: ${getStatusBackgroundColor()};
          border: 1px solid ${getStatusBorderColor()};
        `}
      >
        <div
          css={css`
            width: 50px;
            height: 50px;
            position: relative;
          `}
        >
          <Image
            src="/github.png"
            fill
            alt="github"
            priority
            css={css`
              width: 24px;
              object-fit: cover;
            `}
          />
        </div>
        <h2
          css={css`
            color: ${colors.black};
            text-decoration: none;
            font-size: 2rem;
            font-weight: bold;
          `}
        >
          {getStatusText()}
        </h2>
      </div>
    </>
  );
}
