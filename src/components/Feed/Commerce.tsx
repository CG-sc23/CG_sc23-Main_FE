import Card from "@/components/Card";
import Link from "next/link";
import { colors } from "@/components/constant/color";
import { css } from "@emotion/react";
import { FaChevronRight } from "react-icons/fa";
import { bpmax } from "@/libs/styles/constants";

type Props = { imageUrl: string | undefined };

export function Commerce({ imageUrl }: Props) {
  return (
    <Card>
      <img
        src={imageUrl ?? "/samplecm1.webp"}
        alt="광고"
        css={css`
          width: 100%;
          object-fit: cover;
        `}
      />
      <Link
        href="/"
        css={css`
          display: flex;
          justify-content: space-between;
          border-top: 1px solid ${colors.grey300};
          padding-top: 1rem;
          font-weight: 500;
          font-size: 1rem;
          ${bpmax[0]} {
            display: none;
          }
        `}
      >
        <span>더 알아보러 가기</span>
        <FaChevronRight />
      </Link>
    </Card>
  );
}
