import { bp } from "@/libs/styles/constants";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { AiOutlineMenu } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import useUser from "@/hooks/user/useUser";
import { colors } from "./constant/color";
import { AnimatePresence, motion } from "framer-motion";

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

export const NavContainer = styled.div`
  width: 100vw;
  height: 5rem;
  background-color: black;
`;

export default function MenuBar() {
  const { user, isLoading, isLoggedIn } = useUser();
  const [visibleSubMenu, setVisibleSubMenu] = useState(false);

  const subMenuRef = useRef<HTMLDivElement>(null);

  const onClickOutSide = (e: MouseEvent) => {
    const target = e.target as HTMLDivElement;
    if (!target) return;

    if (visibleSubMenu && !subMenuRef.current?.contains(target)) {
      setVisibleSubMenu(false);
    }
  };

  useEffect(() => {
    if (visibleSubMenu) {
      document.addEventListener("mousedown", onClickOutSide);
    }
    return () => {
      document.removeEventListener("mousedown", onClickOutSide);
    };
  }, [visibleSubMenu, onClickOutSide]);

  const toggleVisibleSubmenu = () => {
    setVisibleSubMenu((prev) => !prev);
  };

  return (
    <NavContainer>
      {/* menubar */}
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;

          width: 100%;
          height: 5rem;

          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          padding: 0 1rem;
          background-color: black;
          color: white;
          z-index: 10;
          /* border-bottom: 1px solid #c0cbda; */
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
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: 0.5rem;
            `}
          >
            <Link href="/">
              <Image src="/icon.svg" alt="logo" width={32} height={32} />
            </Link>
            <Link href="/" css={logoCss}>
              DOMO
            </Link>
          </div>
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
            onClick={toggleVisibleSubmenu}
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
                display: ${visibleSubMenu ? "flex" : "none"};
              `}
            >
              <Link href="/" css={submenuMobileCss}>
                프로젝트
              </Link>
              <Link href="/" css={submenuMobileCss}>
                친구검색
              </Link>
              <Link href={`/user/${user?.name}`} css={submenuMobileCss}>
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
          {isLoggedIn ? (
            <button
              css={css`
                position: relative;
                background-color: transparent;

                user-select: none;
                border: none;
                color: white;

                cursor: pointer;
              `}
              onClick={toggleVisibleSubmenu}
            >
              {isLoading ? null : (
                <Image
                  src={user?.profileImageLink ?? ("/profile.jpg" as string)}
                  alt="profile_image"
                  css={css`
                    border-radius: 9999%;
                    object-fit: cover;
                    cursor: pointer;
                  `}
                  width={50}
                  height={50}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
              <AnimatePresence mode="wait">
                {visibleSubMenu && (
                  <motion.div
                    key="submenu"
                    ref={subMenuRef}
                    initial={{ opacity: 0, y: -10, x: 10 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: -10, x: 10 }}
                    transition={{ duration: 0.3 }}
                    css={css`
                      position: absolute;

                      display: flex;
                      flex-direction: column;

                      width: 100%;

                      gap: 1rem;
                      right: 1rem;
                      top: 4rem;
                      padding: 1rem 1rem;
                      color: black;
                      font-weight: 500;
                      border: 2px solid black;
                      border-radius: 0.25rem;
                      background-color: white;
                      z-index: 10;
                    `}
                  >
                    <Link href={`/user/${user?.id}`} css={submenuMobileCss}>
                      내 계정
                    </Link>
                    <Link href="/settings" css={submenuMobileCss}>
                      설정
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ) : (
            <Link
              href="/auth/SignIn"
              css={css`
                color: ${colors.white};
              `}
            >
              SingIn
            </Link>
          )}
        </div>
      </div>
      {/* menubar */}
      <div
        css={css`
          width: 100%;
          height: 5rem;
        `}
      />
    </NavContainer>
  );
}
