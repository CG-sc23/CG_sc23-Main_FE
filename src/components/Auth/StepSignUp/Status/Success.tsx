import Link from "next/link";
import { motion } from "framer-motion";
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

const MotionHeader = styled(motion.div)`
  font-weight: 600;
  font-size: 2.5rem;
`;

export default function SignUpSuccess() {
  return (
    <ResultWrapper>
      <MotionHeader
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        안녕하세요, DOMO 입니다!
      </MotionHeader>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        css={css`
          font-size: 1.5rem;
        `}
      >
        회원가입이 모두 완료되었습니다.
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
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
          href="/auth/SignIn"
        >
          로그인
        </Link>
      </motion.div>
    </ResultWrapper>
  );
}
