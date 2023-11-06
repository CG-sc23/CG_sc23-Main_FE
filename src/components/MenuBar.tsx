import { bp } from "@/libs/styles/constants";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { AiOutlineMenu } from "react-icons/ai";
import { useState, type PropsWithChildren, FormEvent } from "react";

const logoCss = css({
  fontSize: "1.5rem",
  color: "white",
  textDecoration: "none",
});

const submenuCss = css({
  fontSize: "1rem",
  color: "white",
  textDecoration: "none",
});

const submenuMobileCss = css({
  fontSize: "1rem",
  color: "black",
  textDecoration: "none",
});

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default function MenuBar({ children }: PropsWithChildren) {
  const [showSubmenu, setShowSubmenu] = useState(false);
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
  });

  const handleSubmenuOpen = (e: FormEvent<HTMLButtonElement>) => {
    console.log(showSubmenu);
    setShowSubmenu((prev) => !prev);
  };

  return (
    <Container>
      {/* menubar */}
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          width: 100%;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          height: 5rem;
          padding: 0 1rem;
          background-color: black;
          color: white;
          z-index: 10;
          border-bottom: 1px solid #c0cbda;
        `}
      >
        {/* Left */}
        <div
          css={css`
            display: flex;
            align-items: center;
            gap: 1rem;
          `}
        >
          {/* home */}
          <Link href="/" css={logoCss}>
            DOMO
          </Link>
          {/* submenus in web*/}
          <div
            css={css`
              display: flex;
              padding: 0 1rem;
              gap: 1rem;
              ${bp[0]} {
                display: none;
              }
            `}
          >
            <Link href="/" css={submenuCss}>
              프로젝트
            </Link>
            <Link href="/" css={submenuCss}>
              친구검색
            </Link>
          </div>
        </div>
        {/* Right : submenus in mobile */}
        <div
          css={css`
            display: none;
            ${bp[0]} {
              display: flex;
            }
          `}
        >
          <button
            css={css`
              background-color: transparent;
              border: none;
              color: white;
            `}
            onClick={handleSubmenuOpen}
          >
            <AiOutlineMenu
              css={css`
                width: 1.5rem;
                height: 1.5rem;
              `}
            />
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 1rem;
                position: absolute;
                right: 1rem;
                top: 4rem;
                padding: 1rem 1rem;
                color: black;
                font-weight: 500;
                border: 2px solid black;
                border-radius: 0.25rem;
                background-color: white;
                z-index: 10;
                display: ${showSubmenu ? "flex" : "none"};
              `}
            >
              <Link href="/" css={submenuMobileCss}>
                프로젝트
              </Link>
              <Link href="/" css={submenuMobileCss}>
                친구검색
              </Link>
              <Link href={`/user/${profile.id}`} css={submenuMobileCss}>
                내 계정
              </Link>
              <Link href="/settings" css={submenuMobileCss}>
                설정
              </Link>
            </div>
          </button>
        </div>
        {/* Right : submenus in web */}
        <div
          css={css`
            display: flex;
            align-items: center;
            gap: 1rem;
            ${bp[0]} {
              display: none;
            }
          `}
        >
          <button
            css={css`
              background-color: transparent;
              border: none;
              color: white;
              cursor: pointer;
            `}
            onClick={handleSubmenuOpen}
          >
            <img
              src={profile.image_link}
              alt={"profile_image"}
              css={css`
                width: 2rem;
                height: 2rem;
                border-radius: 9999%;
                object-fit: cover;
              `}
            />
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 1rem;
                position: absolute;
                right: 1rem;
                top: 4rem;
                padding: 1rem 1rem;
                color: black;
                font-weight: 500;
                border: 2px solid black;
                border-radius: 0.25rem;
                background-color: white;
                z-index: 10;
                display: ${showSubmenu ? "flex" : "none"};
              `}
            >
              <Link href={`/user/${profile.id}`} css={submenuMobileCss}>
                내 계정
              </Link>
              <Link href="/settings" css={submenuMobileCss}>
                설정
              </Link>
            </div>
          </button>
        </div>
      </div>
      {/* menubar */}
      <div
        css={css`
          width: 100%;
          height: 4rem;
        `}
      />
      {children}
    </Container>
  );
}
