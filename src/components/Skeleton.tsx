import styled from '@emotion/styled';
import { colors } from './constant/color';
import { PropsWithChildren } from 'react';

const Container = styled.div<{ bgColor: string; borderColor: string }>`
  position: relative;
  min-height: 300px;
  width: 100%;
  margin-bottom: 1.5rem;

  display: flex;

  justify-content: center;
  align-items: center;

  gap: 10px;

  background-color: ${(props) => props.bgColor};
  border: 1px solid ${(props) => props.borderColor};
`;

const Content = styled.div`
  color: ${(props) => props.color};
  text-decoration: none;
  font-size: 2rem;
  font-weight: bold;

  display: flex;

  justify-content: center;
  align-items: center;

  gap: 10px;
`;

interface Props extends PropsWithChildren {
  bgColor?: string;
  borderColor?: string;
  color?: string;
}
export default function Skeleton({
  children,
  bgColor = colors.grey50,
  borderColor = colors.grey200,
  color = colors.black,
}: Props) {
  return (
    <Container bgColor={bgColor} borderColor={borderColor}>
      <Content color={color}>{children}</Content>
    </Container>
  );
}
