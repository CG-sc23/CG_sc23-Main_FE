import Card from '@/components/Card';
import Link from 'next/link';
import { colors } from '@/components/constant/color';
import { css } from '@emotion/react';
import { FaChevronRight } from 'react-icons/fa';
import { bpmax } from '@/libs/styles/constants';
import { useState } from 'react';
import ConditionalRendering from '../ConditionalRendering';
import LoadingSpinner from '../Spinner';

type Props = { imageUrl?: string; href?: string };

export function Commerce({ imageUrl, href }: Props) {
  const [imageLoading, setImageLoading] = useState(false);
  return (
    <Card
      css={css`
        position: relative;
        min-height: 28rem;
        justify-content: flex-end !important;
      `}
    >
      <img
        src={`${imageUrl}?${href}`}
        alt={`ADS_${imageUrl}`}
        onLoad={() => setImageLoading(true)}
        css={css`
          width: 100%;
          object-fit: cover;
          z-index: 5;
          display: ${imageLoading ? 'block' : 'none'};
        `}
      />
      <ConditionalRendering condition={!imageLoading}>
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 28rem;
            background-color: ${colors.grey100};
            font-size: 2rem;
            color: white;
            font-weight: 500;
          `}
        >
          광고
        </div>
      </ConditionalRendering>
      <Link
        href={href ?? '/'}
        css={css`
          display: flex;
          justify-content: space-between;
          border-top: 1px solid ${colors.grey300};
          padding-top: 1rem;
          font-weight: 500;
          font-size: 1rem;

          /* mobile */
          ${bpmax[0]} {
            display: none;
          }
        `}
      >
        <span>더 알아보러 가기</span>
        <FaChevronRight />
      </Link>
    </Card>
  );
}
