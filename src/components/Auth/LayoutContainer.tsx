import styled from "@emotion/styled";
import { type PropsWithChildren } from "react";
import { bpmax } from "@/libs/styles/constants";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 448px;
  height: 100%;

  ${bpmax[0]} {
    width: 80%;
  }
`;

export default function LayoutContainer({ children }: PropsWithChildren) {
  return <Container>{children}</Container>;
}
