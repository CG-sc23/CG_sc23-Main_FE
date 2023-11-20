import { PropsWithChildren } from "react";
import styled from "@emotion/styled";
import { bpmax } from "@/libs/styles/constants";

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
  row-gap: 1.5rem;
  column-gap: 1.5rem;
  width: 100%;

  ${bpmax[0]} {
    grid-template-columns: 1fr;
    row-gap: 0;
  }
`;

export default function ProjectWrapper({ children }: PropsWithChildren) {
  return <Wrapper>{children}</Wrapper>;
}
