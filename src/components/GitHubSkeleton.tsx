import { css } from '@emotion/react';
import Image from 'next/image';
import { colors } from './constant/color';

type Props = {
  title: string;
};
export default function GitHubSkeleton({ title }: Props) {
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

          background-color: ${colors.grey200};
          border: 1px solid ${colors.grey400};
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
          GitHub 주소가 없어요...!
        </h2>
      </div>
    </>
  );
}
