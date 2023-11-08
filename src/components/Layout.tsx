import { PropsWithChildren } from "react";
import styled from "@emotion/styled";
import { bp } from "@/libs/styles/constants";

const LayoutContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${bp[0]} {
    width: 100vw;
    height: 90vh;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
`;

export default function Layout({ children }: PropsWithChildren) {
  return <LayoutContainer> {children}</LayoutContainer>;
}
