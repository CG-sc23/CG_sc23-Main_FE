import { PropsWithChildren } from 'react';
import styled from '@emotion/styled';
import { bpmax } from '@/libs/styles/constants';

const Wrapper = styled.section`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  row-gap: 1.5rem;
  column-gap: 1.5rem;
  width: 100%;

  ${bpmax[0]} {
    display: flex;
    flex-direction: column;
  }
`;

export default function ProjectWrapper({ children }: PropsWithChildren) {
  return <Wrapper>{children}</Wrapper>;
}
