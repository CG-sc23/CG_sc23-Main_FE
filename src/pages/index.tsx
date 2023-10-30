// import Card from '@/components/Card';
import { css } from '@emotion/react';
import Link from 'next/link';
// import { colors } from '@/components/constant/color';
// import InputWithLabel from '@/components/InputWithLabel';

export default function Home() {
  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <Link href="/auth/signIn">test</Link>
    </div>
  );
}
