import { ReactNode } from "react";
import { css } from "@emotion/react";
import Link from "next/link";
import Card from "../Card";
import { FaChevronRight } from "react-icons/fa6";

type Props = { children : ReactNode, title : string, showChevron : boolean, href : string | null | undefined };

export function Block({ children, title, showChevron = true, href} : Props) {
  return (
    <Card>
      <div css={css`display : flex; gap : 1rem;`}>
        <h2 css={css`font-weight : 500;`}>{title}</h2>
        <Link href={href ?? "/"}>
          <FaChevronRight />
        </Link>
      </div>
      {children}
    </Card>
    );
}