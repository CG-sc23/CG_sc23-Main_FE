import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { colors } from "../constant/color";
import Card from "../Card";
import { bpmax } from "@/libs/styles/constants";

type Props = {
  title: string;
  author: string;
  projectTitle: string;
  projectId: string;
  likes: number;
};

const HR = styled.hr`
  width: 100%;
  color: gray;
  border: 0.5px solid ${colors.grey700};
`;

export function Project({
  title,
  projectTitle,
  projectId,
  author,
  likes,
}: Props) {
  return (
    <Card>
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
    </Card>
  );
}
