import { bpmax } from "@/libs/styles/constants";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { colors } from "../constant/color";

type Props = {
  name: string;
  profile: string | undefined | null;
  id: string;
  short_description: string;
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 10rem;
  padding: 1rem;
  border-radius: 0.2rem;
  border: 0.1rem solid ${colors.grey200};
  gap: 1rem;

  ${bpmax[0]} {
    width: 8rem;
  }

  &:hover {
    background-color: ${colors.grey800};
    color: white;
    cursor: pointer;
  }
`;

export function User({ name, profile, id, short_description }: Props) {
  return (
    <Container>
      {/* profile image */}
      <img
        src={profile ?? "/profile.jpg"}
        alt={name}
        css={css`
          width: 100%;
          object-fit: contain;
        `}
      />
      {/* name */}
      <h1
        css={css`
          font-size: 1rem;
          font-weight: 600;
        `}
      >
        {name}
      </h1>
      {/* short_description */}
      <p
        css={css`
          font-size: 0.8rem;
        `}
      >
        {short_description ?? ""}
      </p>
    </Container>
  );
}
