import { useMemo, useState } from 'react';
import Image from 'next/image';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { hexToRgba } from '@toss/utils';
import { useQuery } from '@tanstack/react-query';

import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
  GitHubStackResponse,
  GithubUpdateStatusResponse,
} from '@/libs/type/client';
import client from '@/api/client';

import { useQueryParam } from '@/hooks/useQueryParam';

import { colors } from '@/components/constant/color';
import LoadingSpinner from '@/components/Spinner';
import GitHubSkeleton from '@/components/Profile/GitHubSkeleton';
import { bpmax } from '@/libs/styles/constants';

import {
  extractBGHexFromUrl,
  extractLogoHexFromUrl,
  preProcessCommonStackName,
} from '@/libs/utils';

import { roboto } from '@/pages/_app';
import { queryKey } from '@/libs/constant';

const flipAnimation = {
  hidden: { rotateY: 0 },
  visible: { rotateY: 180 },
};

const Container = styled.div`
  position: relative;
  min-height: 300px;
  width: 100%;
  margin-bottom: 1.5rem;

  display: flex;
  flex-direction: column;

  ${bpmax[1]} {
    display: block;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
`;

const Content = styled.div`
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
`;

const ChartWrapper = styled.div`
  width: 50%;

  ${bpmax[1]} {
    display: none;
  }
`;

const StackWrapper = styled.div`
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
`;
const Stack = styled(motion.div)`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.color};

  user-select: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;
const BackOfStack = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotateY(180deg);

  font-weight: bold;
  font-size: 2rem;
  color: ${colors.white};
`;
const FrontOfStack = styled.div`
  position: relative;
  width: 100%;
`;
const FrontOfStackNoLogo = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.color};

  color: white;
  font-weight: bold;
  font-size: 2rem;

  display: flex;
  align-items: center;
  justify-content: center;
`;

type Logo = {
  name: string;
  lines: number;
  url: string | null;
  color: string;
  alphaColor: string;
  logoColor: string;
};
type Props = {
  status: GithubUpdateStatusResponse['status'];
  title: '언어' | '라이브러리';
};
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);
const ETC = 'Etc';
export default function GithubStatistic({ status, title }: Props) {
  if (!status || status !== 'COMPLETE') {
    return <GitHubSkeleton title={title} status={status} />;
  }

  const [flipBinary, setFlipBinary] = useState('000000');
  const onFlipBinary = (idx: number) => {
    if (flipBinary.at(idx) === '1')
      setFlipBinary((prev) => prev.slice(0, idx) + '0' + prev.slice(idx + 1));
    else
      setFlipBinary((prev) => prev.slice(0, idx) + '1' + prev.slice(idx + 1));
  };

  const COUNTING_UNIT = useMemo(
    () => (title === '언어' ? 'Lines' : 'Uses'),
    [title],
  );

  const id = useQueryParam('id');
  const { data: stackList } = useQuery({
    queryKey: [queryKey.USER_STACK, id, title],
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
      return etc
        ? [...sorted.slice(0, threshold), [ETC, etc]]
        : sorted.slice(0, threshold);
    },
    enabled: !!id,
    retry: 0,
  });

  const { data: logoList } = useQuery({
    queryKey: [queryKey.USER_STACK, id, title, queryKey.USER_STACK_LOGOS],
    queryFn: async () => {
      if (!stackList) return;
      const logos = await Promise.allSettled(
        stackList.map((s) => {
          const [name, _] = s;
          if (name === ETC) return null;

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
    return logoList?.map((logo, idx) => {
      if (!logo?.url) {
        return {
          name: stackList?.at(idx)?.at(0),
          lines: stackList?.at(idx)?.at(1),
          url: null,
          color: '#515151',
          alphaColor: hexToRgba('#515151', 0.3),
        };
      }

      const url = logo.url;
      const colorHexValue = extractBGHexFromUrl(logo.url);
      const logoHexValue = extractLogoHexFromUrl(logo.url);
      const color = `#${colorHexValue}`;
      const logoColor = `#${logoHexValue}`;
      const alphaColor = hexToRgba(logoColor, 0.3);

      return {
        name: stackList?.at(idx)?.at(0),
        lines: stackList?.at(idx)?.at(1),
        url,
        color,
        alphaColor,
        logoColor,
      };
    });
  }, [logoList, stackList]);

  const chartData = useMemo(() => {
    const labels = stackList?.map((s) => s[0]);
    const data = stackList?.map((s) => s[1]);
    const backgroundColor = logoData?.map((l) => l.alphaColor);
    const borderColor = logoData?.map((l) => l.logoColor);

    return {
      labels,
      datasets: [
        {
          label: `# of ${COUNTING_UNIT}`,
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
      ],
    };
  }, [logoData, stackList]);

  const hasData = useMemo(
    () => !!chartData && !!logoData,
    [chartData, logoData],
  );

  const getStackFlip = (logo: Logo, isBackSide: boolean) => {
    if (isBackSide) {
      return (
        <BackOfStack>
          {logo.lines?.toLocaleString()}&nbsp;{COUNTING_UNIT}
        </BackOfStack>
      );
    }

    if (logo?.url) {
      return (
        <FrontOfStack>
          <Image
            src={logo.url}
            alt={logo.color}
            fill
            unoptimized
            priority
            sizes="(max-width: 768px) 100px, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: 'contain',
            }}
          />
        </FrontOfStack>
      );
    }

    return (
      <FrontOfStackNoLogo color={logo.color}>
        {logo.name?.toString().toUpperCase()}
      </FrontOfStackNoLogo>
    );
  };

  return (
    <Container>
      <Title>{title}</Title>
      <Content>
        {hasData ? (
          <>
            <ChartWrapper>
              <Pie
                data={chartData}
                options={{
                  plugins: {
                    datalabels: {
                      formatter: (value, context) => {
                        return context.chart.data.labels?.at(context.dataIndex);
                      },
                      color: colors.black,
                      font: {
                        weight: 'bold',
                        size: 20,
                        family: roboto.style.fontFamily,
                      },
                    },
                  },
                }}
              />
            </ChartWrapper>
            <StackWrapper>
              {logoData?.map((logo, idx) => (
                <Stack
                  initial="hidden"
                  animate={flipBinary.at(idx) === '1' ? 'visible' : 'hidden'}
                  variants={flipAnimation}
                  onClick={() => onFlipBinary(idx)}
                  color={logo.color}
                >
                  {getStackFlip(logo as Logo, flipBinary.at(idx) === '1')}
                </Stack>
              ))}
            </StackWrapper>
          </>
        ) : (
          <LoadingSpinner />
        )}
      </Content>
    </Container>
  );
}
