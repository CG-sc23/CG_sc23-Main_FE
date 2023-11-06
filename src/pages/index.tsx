// import Card from '@/components/Card';
import useSignOut from '@/hooks/auth/useSignOut';
import { css } from '@emotion/react';
import Link from 'next/link';
// import { colors } from '@/components/constant/color';
// import InputWithLabel from '@/components/InputWithLabel';

export default function Home() {
  const { signOut } = useSignOut();
  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `}
    >
      <Link href="/auth/SignIn">SignIn</Link>
      <Link href="/auth/SignUp">SignUp</Link>
      <button type="button" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
}
