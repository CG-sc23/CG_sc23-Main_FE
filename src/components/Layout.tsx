import { PropsWithChildren } from 'react';
import styled from '@emotion/styled';
import { bpmax } from '@/libs/styles/constants';
import { colors } from './constant/color';

const LayoutContainer = styled.div`
  width: 100vw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  background-color: ${colors.grey100};

  ${bpmax[0]} {
    width: 100vw;
    height: 90vh;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background-color: white;
  }
`;

export default function Layout({ children }: PropsWithChildren) {
  return <LayoutContainer>{children}</LayoutContainer>;
}
