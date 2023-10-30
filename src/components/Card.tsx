import styled from '@emotion/styled';
import { type PropsWithChildren } from 'react';

const Container = styled.div`
  position: relative;
  padding: 2rem 4rem;
  max-width: 500px;

  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  box-shadow: 1px 13px 48px -3px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 1px 13px 48px -3px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 1px 13px 48px -3px rgba(0, 0, 0, 0.3);
`;

export default function Card({ children }: PropsWithChildren) {
  return <Container>{children}</Container>;
}
