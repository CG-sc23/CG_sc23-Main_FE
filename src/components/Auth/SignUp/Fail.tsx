import Link from "next/link";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { colors } from "@/components/constant/color";

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  width: 100%;
  padding: 0 2rem;
`;

export default function SignUpFail() {
  return (
    <ResultWrapper>
      <div
        css={css`
          font-size: 1.5rem;
        `}
      >
        회원가입에 실패하였습니다.
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1rem;
        `}
      >
        <Link
          css={css`
            padding: 1rem 8rem;
            border-radius: 0.5rem;
            border: 1px solid black;
            font-size: 1.2rem;
            box-shadow: 2px 2px 4px ${colors.grey500};
          `}
          href="/"
        >
          홈으로
        </Link>
        <Link
          css={css`
            padding: 1rem 8rem;
            border-radius: 0.5rem;
            background-color: black;
            color: white;
            font-size: 1.2rem;
            box-shadow: 2px 2px 4px ${colors.grey500};
          `}
          href="/auth/SignUp"
        >
          회원가입
        </Link>
      </div>
    </ResultWrapper>
  );
}
