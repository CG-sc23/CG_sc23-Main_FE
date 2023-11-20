import { useQueryParam } from '@/hooks/useQueryParam';
import { useQuery } from '@tanstack/react-query';

import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import LoadingSpinner from './Spinner';
import { css } from '@emotion/react';
import client from '@/api/client';
import { hexToRgba } from '@toss/utils';
import { GitHubStackResponse } from '@/libs/type/client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import { preProcessCommonStackName } from '@/libs/utils';

import { motion } from 'framer-motion';
import { colors } from './constant/color';
import { bp } from '@/libs/styles/constants';
import GitHubSkeleton from './GitHubSkeleton';

const flipAnimation = {
  hidden: { rotateY: 0 },
  visible: { rotateY: 180 },
};

const extractHexFromUrl = (url: string): string | null => {
  const urlSearchParams = new URLSearchParams(url.split('?')[1]);
  const logoColor = urlSearchParams.get('logoColor');

  if (logoColor === 'white' || logoColor === 'black' || !logoColor) {
    const languageHexMatch = url.match(/-%23([0-9A-Fa-f]{6})/);
    if (languageHexMatch) return languageHexMatch[1];

    const languageHexMatchWithout23 = url.match(/-([0-9A-Fa-f]{6})\?style/);
    if (languageHexMatchWithout23) return languageHexMatchWithout23[1];

    const languageWordMatch = url.match(/-([0-9A-Za-z]+)\?style/);
    if (languageWordMatch) return '000000';
  }

  const logoColorHexMatch = url.match(/logoColor=%23([0-9A-Fa-f]{6})/);
  return logoColorHexMatch ? logoColorHexMatch[1] : null;
};

type Props = {
  hasGitHub: boolean;
};
Chart.register(ArcElement, Tooltip, Legend);
export default function Stack({ hasGitHub = true }: Props) {
  if (!hasGitHub) return <GitHubSkeleton title="언어" />;
  const [flipBinary, setFlipBinary] = useState('000000');
  const id = useQueryParam('id');
  const { data: stackList } = useQuery({
    queryKey: ['USER_STACK', id],
    queryFn: async () => {
      return await client.gitHubStack({
        user_id: id as string,
      });
    },
    select: (r: unknown) => {
      if (!r) return null;
      const res = r as GitHubStackResponse;
      if (!res.stacks) return null;
      const threshold = 5;

      const sorted = Object.entries(res.stacks).sort((a, b) => {
        if (a[1] > b[1]) return -1;
        if (a[1] === b[1]) return 0;
        return 1;
      });
      const ect = sorted.reduce((acc, cur, idx) => {
        if (idx < threshold) return acc;
        return acc + cur[1];
      }, 0);
      return [...sorted.slice(0, threshold), ['ect', ect]];
    },
    enabled: !!id,
    retry: 0,
  });

  const { data: logoList } = useQuery({
    queryKey: ['USER_STACK', id, 'LOGOS'],
    queryFn: async () => {
      if (!stackList) return;
      const logos = await Promise.allSettled(
        stackList.map((s) => {
          const [name, _] = s;
          const stack = preProcessCommonStackName(`${name}`);
          return client.commonStack({ stack: stack as string });
        }),
      );

      if (!logos) return null;
      return logos.map((logo) => {
        if (logo.status === 'rejected') return null;
        if (!logo.value) return null;

        return logo.value;
      });
    },

    enabled: !!stackList,
    retry: 0,
  });

  const logoData = useMemo(() => {
    return logoList?.map((logo) => {
      if (!logo?.url)
        return {
          url: null,
          color: '#515151',
          alphaColor: hexToRgba('#515151', 0.3),
        };
      const url = logo.url;
      const hexValue = extractHexFromUrl(logo.url);
      const color = `#${hexValue}`;
      const alphaColor = hexToRgba(color, 0.3);

      return {
        url,
        color,
        alphaColor,
      };
    });
  }, [logoList]);

  const chartData = useMemo(() => {
    const labels = stackList?.map((s) => s[0]);
    const data = stackList?.map((s) => s[1]);
    const backgroundColor = logoData?.map((l) => l.alphaColor);
    const borderColor = logoData?.map((l) => l.color);

    return {
      labels,
      datasets: [
        {
          label: '# of Lines',
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
      ],
    };
  }, [logoData, stackList]);

  return (
    <div
      css={css`
        position: relative;
        min-height: 300px;
        width: 100%;
        margin-bottom: 1.5rem;

        display: flex;
        flex-direction: column;

        ${bp[1]} {
          display: block;
        }
      `}
    >
      <h1
        css={css`
          font-size: 1.5rem;
          font-weight: bold;
          padding-bottom: 0.5rem;
          margin-bottom: 1rem;
          border-bottom: 2px solid #e0e0e0;
        `}
      >
        언어
      </h1>
      <div
        css={css`
          position: relative;
          display: flex;
          width: 100%;

          flex: 1;

          justify-content: center;
          align-items: center;

          ${bp[1]} {
            display: block;
            height: 100%;
          }
        `}
      >
        {!!chartData && !!logoData ? (
          <>
            <div
              css={css`
                width: 50%;

                ${bp[1]} {
                  display: none;
                }
              `}
            >
              <Pie data={chartData} />
            </div>
            <div
              css={css`
                position: relative;
                width: 50%;
                height: 100%;

                display: flex;
                flex-direction: column;

                ${bp[1]} {
                  width: 100%;
                }
              `}
            >
              {logoData?.map((logo, idx) => (
                <motion.div
                  key={logo.url}
                  css={css`
                    position: relative;
                    display: flex;
                    width: 100%;
                    height: 100%;
                    background-color: ${logo.color};

                    user-select: none;
                    cursor: pointer;

                    transition: opacity 0.2s ease;

                    &:hover {
                      opacity: 0.9;
                    }
                  `}
                  initial="hidden"
                  animate={flipBinary.at(idx) === '1' ? 'visible' : 'hidden'}
                  variants={flipAnimation}
                  onClick={() => {
                    if (flipBinary.at(idx) === '1')
                      setFlipBinary(
                        (prev) =>
                          prev.slice(0, idx) + '0' + prev.slice(idx + 1),
                      );
                    else
                      setFlipBinary(
                        (prev) =>
                          prev.slice(0, idx) + '1' + prev.slice(idx + 1),
                      );
                  }}
                >
                  {flipBinary.at(idx) === '1' ? (
                    <div
                      css={css`
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        transform: rotateY(180deg);

                        font-weight: bold;
                        font-size: 2rem;
                        color: ${colors.white};
                      `}
                    >
                      {stackList?.at(idx)?.at(1)?.toLocaleString()} Uses
                    </div>
                  ) : logo.url ? (
                    <div
                      css={css`
                        position: relative;
                        width: 100%;
                      `}
                    >
                      <Image
                        src={logo.url}
                        fill
                        alt={logo.color}
                        priority
                        sizes="(max-width: 768px) 100px, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      css={css`
                        width: 100%;
                        height: 100%;
                        background-color: ${logo.color};

                        color: white;
                        font-weight: bold;
                        font-size: 2rem;

                        display: flex;
                        align-items: center;
                        justify-content: center;
                      `}
                    >
                      ECT
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
}