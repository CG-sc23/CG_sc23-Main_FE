import { ReactNode } from "react";
import { css } from "@emotion/react";
import Link from "next/link";
import Card from "../Card";
import { FaChevronRight } from "react-icons/fa6";
import { bpmax, bpmin } from "@/libs/styles/constants";

type Props = {
  children: ReactNode;
  title?: string;
  showChevron?: boolean;
  hasTitle?: boolean;
  href?: string;
};

export function Block({
  children,
  hasTitle = false,
  title,
  showChevron = true,
  href,
}: Props) {
  return (
    <Card>
      {hasTitle ? (
        <Link
          href={href ?? "/"}
          css={css`
            display: flex;
            align-items: center;
            gap: 0.5rem;

            /* mobile */
            ${bpmax[0]} {
              margin-top: 1rem;
            }
          `}
        >
          <h2
            css={css`
              font-size: 1.2rem;
              font-weight: 500;
            `}
          >
            {title}
          </h2>
          {showChevron ? <FaChevronRight /> : <></>}
        </Link>
      ) : (
        <></>
      )}
      {children}
    </Card>
  );
}
