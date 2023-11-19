import Card from "@/components/Card";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { PropsWithChildren } from "react";

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export function Carousel({ children }: PropsWithChildren) {
  return (
    <CardWrapper>
      {/* lists */}
      <div
        css={css`
          display: flex;
          gap: 1rem;
          width: max-content;
        `}
      >
        {children}
      </div>
    </CardWrapper>
  );
}
