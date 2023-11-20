import { css } from "@emotion/react";
import { bpmax } from "@/libs/styles/constants";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";

export default function AppBar() {
  const router = useRouter();

  return (
    <div
      css={css`
        z-index: 10;
        display: none;
        ${bpmax[0]} {
          display: flex;
        }
      `}
    >
      <div
        css={css`
          position: fixed;
          display: flex;
          align-items: center;
          padding: 0 1rem;
          width: 100%;
          height: 4rem;
          background-color: black;
        `}
      >
        <button
          css={css`
            -webkit-appearance: none;
            background-color: black;
            border: none;
          `}
          onClick={(e) => router.back()}
        >
          <BiArrowBack
            css={css`
              width: 2rem;
              height: 2rem;
              color: white;
            `}
          />
        </button>
      </div>
      <div
        css={css`
          width: 100vw;
          height: 5rem;
        `}
      />
    </div>
  );
}
