import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { colors } from "../constant/color";
import { bpmax, bpmin } from "@/libs/styles/constants";
import Link from "next/link";

type Props = {
  title: string;
  owner: string;
  projectTitle: string;
  projectId: number;
  likes: number;
  created_at : string;
  id:number;
};

export const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 16rem;
  padding: 1rem;
  border-radius: 0.2rem;
  border: 0.1rem solid ${colors.grey200};
  gap: 1rem;

  ${bpmin[0]} {
    &:hover {
      background-color: ${colors.grey800};
      color: white;
      cursor: pointer;
    }
  }
`;

const HR = styled.hr`
  width: 100%;
  color: gray;
  border: 0.5px solid ${colors.grey700};
`;

export function Project({
  title,
  projectTitle,
  projectId,
  owner,
  likes,
  created_at,
  id
}: Props) {
  return (
    <Container href={`/projects/${id}`}>
      {/* title */}
      <h1
        css={css`
          font-size: 1.2rem;
          font-weight: 600;
        `}
      >
        {title}
      </h1>
      <HR />
      {/*  */}
    </Container>
  );
}
