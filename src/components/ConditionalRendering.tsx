import { AnimatePresence } from 'framer-motion';
import { PropsWithChildren, ReactNode } from 'react';
import styled from '@emotion/styled';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

type Props = {
  condition: boolean;
  fallback?: (() => ReactNode) | null;
  isAnimate?: boolean;
} & PropsWithChildren;
export default function ConditionalRendering({
  condition,
  children,
  fallback = null,
  isAnimate = false,
}: Props) {
  if (isAnimate) {
    return (
      <Container>
        <AnimatePresence mode="sync">
          {condition ? children : fallback ? fallback() : null}
        </AnimatePresence>
      </Container>
    );
  }
  return condition ? children : fallback ? fallback() : null;
  // return (
  //   <Container>
  //     <AnimatePresence mode="sync">
  //       {condition ? children : fallback ? fallback() : null}
  //     </AnimatePresence>
  //   </Container>
  // );
}
