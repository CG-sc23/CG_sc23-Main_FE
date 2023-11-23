import { useQueryParam } from '@/hooks/useQueryParam';
import { useQuery } from '@tanstack/react-query';

import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import LoadingSpinner from './Spinner';
import { css } from '@emotion/react';
import client from '@/api/client';
import { hexToRgba } from '@toss/utils';
import {
  GitHubStackResponse,
  GithubUpdateStatusResponse,
} from '@/libs/type/client';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  extractBGHexFromUrl,
  extractLogoHexFromUrl,
  preProcessCommonStackName,
} from '@/libs/utils';

import { motion } from 'framer-motion';
import { colors } from './constant/color';
import { bpmax } from '@/libs/styles/constants';
import GitHubSkeleton from './GitHubSkeleton';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { roboto } from '@/pages/_app';

const flipAnimation = {
  hidden: { rotateY: 0 },
  visible: { rotateY: 180 },
};

type Props = {
  status: GithubUpdateStatusResponse['status'];
};
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);
export default function Stack({ status }: Props) {
  if (!status || status !== 'COMPLETE') {
    return <GitHubSkeleton title="언어" status={status} />;
  }
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
      const etc = sorted.reduce((acc, cur, idx) => {
        if (idx < threshold) return acc;
        return acc + cur[1];
      }, 0);
      return [...sorted.slice(0, threshold), ['Etc', etc]];
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
      const colorHexValue = extractBGHexFromUrl(logo.url);
      const logoHexValue = extractLogoHexFromUrl(logo.url);
      const color = `#${colorHexValue}`;
      const logoColor = `#${logoHexValue}`;
      const alphaColor = hexToRgba(logoColor, 0.3);

      return {
        url,
        color,
        alphaColor,
        logoColor,
      };
    });
  }, [logoList]);

  const chartData = useMemo(() => {
    const labels = stackList?.map((s) => s[0]);
    const data = stackList?.map((s) => s[1]);
    const backgroundColor = logoData?.map((l) => l.alphaColor);
    const borderColor = logoData?.map((l) => l.logoColor);

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

        ${bpmax[1]} {
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

          ${bpmax[1]} {
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

                ${bpmax[1]} {
                  display: none;
                }
              `}
            >
              <Pie
                data={chartData}
                options={{
                  plugins: {
                    datalabels: {
                      formatter: (value, context) => {
                        return context.chart.data.labels?.at(context.dataIndex);
                      },
                      color: colors.black,
                      // textShadowColor: colors.black,
                      // textStrokeColor: colors.white,
                      // textStrokeWidth: 1.5,
                      // textShadowBlur: 10,
                      font: {
                        weight: 'bold',
                        size: 20,
                        family: roboto.style.fontFamily,
                      },
                    },
                  },
                }}
              />
            </div>
            <div
              css={css`
                position: relative;
                width: 50%;
                height: 100%;

                display: flex;
                flex-direction: column;

                border-radius: 10px;
                overflow: hidden;

                ${bpmax[1]} {
                  width: 100%;
                  height: 400px;
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
                      {stackList?.at(idx)?.at(1)?.toLocaleString()} Lines
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
                          objectFit: 'contain',
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
                      ETC
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
