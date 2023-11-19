import { bpmax, bpmin } from "@/libs/styles/constants";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { colors } from "../constant/color";
import Link from "next/link";

type Props = {
  name: string;
  profile: string | undefined | null;
  id: string;
  short_description: string;
};

export const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 10rem;
  padding: 1rem;
  border-radius: 0.2rem;
  border: 0.1rem solid ${colors.grey200};
  gap: 1rem;

  /* mobile */
  ${bpmax[0]} {
    width: 9rem;
    box-shadow: 2px 2px 4px ${colors.grey400};
    margin-right: 4px;
    margin-bottom: 4px;
  }

  /* web */
  ${bpmin[0]} {
    &:hover {
      background-color: ${colors.grey800};
      color: white;
      cursor: pointer;
    }
  }
`;

export function User({ name, profile, id, short_description }: Props) {
  return (
    <Container href={`/user/${id}`}>
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
          font-size: 1.2rem;
          font-weight: 500;
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
