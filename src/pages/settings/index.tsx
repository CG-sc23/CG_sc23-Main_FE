import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useState } from "react";
import Link from "next/link";
import { AiOutlineRight } from "react-icons/ai";
import Switch from "react-switch";

import { bpmax } from "@/libs/styles/constants";
import { mySingupStrategy } from "@/libs/utils/profile";
import useDeactivate from "@/hooks/user/useDeactivate";
import useSignOut from "@/hooks/auth/useSignOut";

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 3rem;
`;

const Divider = styled.div`
  width: 100%;
  height: 2px;
  background-color: #cdcdcd;
`;

const H2 = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
`;

const Linker = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  text-decoration: none;
  color: black;
`;

const Button = styled.button`
  border: none;
  outline: none;
  background: none;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  text-decoration: none;
  color: black;
  font-size: 1rem;
  cursor: pointer;
`;

export default function Settings() {
  const [profile, setProfile] = useState({
    id: null,
    email: "jun@google.com",
    name: "임준혁",
    github_link: "hello@github.com",
    image_link: "/profile.jpg",
    short_description: "안녕하세요 올리버쌤입니다.".repeat(5),
    grade: 1,
    like: 12,
    rating: 4.3,
    provider: "our",
  });

  const { deactivate } = useDeactivate();
  const { signOut } = useSignOut();

  const [checked, setChecked] = useState(false);
  const handleToggleChange = (nextChecked: boolean) => setChecked(nextChecked);

  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <div
        css={css`
          width: 512px;
          margin: 0 auto;
          padding: 3rem;
          display: flex;
          flex-direction: column;
          ${bpmax[0]} {
            padding: 3rem 0;
            width: 90%;
          }
        `}
      >
        <h1
          css={css`
            font-size: 1.5rem;
            font-weight: 600;
          `}
        >
          설정
        </h1>
        {/* 내 가입 정보 */}
        <Block>
          <H2>내 가입 정보</H2>
          <div>
            <p
              css={css`
                text-decoration: none;
              `}
            >
              {profile.email}
            </p>
            <p
              css={css`
                margin-top: 0.5rem;
                color: #cdcdcd;
              `}
            >
              {mySingupStrategy(profile.provider)}
            </p>
          </div>
        </Block>
        {/* 계정 설정 : 비밀번호 변경 */}
        <Block>
          <H2>계정</H2>
          <Linker href="/auth/PasswordReset">
            <span
              css={css`
                font-weight: 500;
              `}
            >
              비밀번호 변경
            </span>
            <AiOutlineRight />
          </Linker>
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 1rem 0;
              text-decoration: none;
              color: black;
            `}
          >
            <span
              css={css`
                font-weight: 500;
              `}
            >
              계정 공개 범위 변경
            </span>
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: 1rem;
              `}
            >
              <span>{checked ? "공개" : "비공개"}</span>
              <Switch
                onChange={handleToggleChange}
                checked={checked}
                checkedIcon={false}
                uncheckedIcon={false}
              />
            </div>
          </div>
          <Button type="button" onClick={() => deactivate()}>
            <span
              css={css`
                font-weight: 500;
              `}
            >
              회원탈퇴
            </span>
            <AiOutlineRight />
          </Button>
          <Button type="button" onClick={() => signOut()}>
            <span
              css={css`
                font-weight: 500;
              `}
            >
              로그아웃
            </span>
            <AiOutlineRight />
          </Button>
        </Block>
      </div>
    </div>
  );
}
