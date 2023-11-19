import Card from "@/components/Card";
import styled from "@emotion/styled";
import { User, Container as UserContainer } from "./User";
import { css } from "@emotion/react";

const CardWrapper = styled(Card)`
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

{
  /* TODO : Need to recommend other users */
}
const Users = [
  {
    name: "임준혁",
    profile: "/profile.jpg",
    id: "12",
    short_description: "안녕하세요, 임준혁입니다. 환영합니다. DOMO입니다.",
  },
  {
    name: "임준혁",
    profile: "/profile.jpg",
    id: "12",
    short_description: "안녕하세요, 임준혁입니다. 환영합니다. DOMO입니다.",
  },
  {
    name: "임준혁",
    profile: "/profile.jpg",
    id: "12",
    short_description: "안녕하세요, 임준혁입니다. 환영합니다. DOMO입니다.",
  },
  {
    name: "임준혁",
    profile: "/profile.jpg",
    id: "12",
    short_description: "안녕하세요, 임준혁입니다. 환영합니다. DOMO입니다.",
  },
  {
    name: "임준혁",
    profile: "/profile.jpg",
    id: "12",
    short_description: "안녕하세요, 임준혁입니다. 환영합니다. DOMO입니다.",
  },
  {
    name: "임준혁",
    profile: "/profile.jpg",
    id: "12",
    short_description: "안녕하세요, 임준혁입니다. 환영합니다. DOMO입니다.",
  },
  {
    name: "임준혁",
    profile: "/profile.jpg",
    id: "12",
    short_description: "안녕하세요, 임준혁입니다. 환영합니다. DOMO입니다.",
  },
];

export function UserCarousel() {
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
        {Users.map((user) => (
          <User
            key={user.id}
            name={user.name}
            profile={user.profile}
            short_description={user.short_description}
            id={user.id}
          />
        ))}
        <UserContainer>
          <span
            css={css`
              font-size: 1.5rem;
            `}
          >
            더보기
          </span>
        </UserContainer>
      </div>
    </CardWrapper>
  );
}
