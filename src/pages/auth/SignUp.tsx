import FunnelSignUp from '@/components/Auth/FunnelSignUp';
import { css } from '@emotion/react';
import LayoutContainer from '@/components/Auth/LayoutContainer';
import Link from 'next/link';

export default function SignUp() {
  return (
    <LayoutContainer>
      <span
        css={css`
          padding: 0 2rem;
          font-size: 1.5rem;
          word-break: break-all;
          line-break: auto;
          text-align: center;
        `}
      >
        By logging in, you accept our <Link href="/">terms</Link> and privacy{' '}
        <Link href="/">policy</Link>.
      </span>
      <FunnelSignUp />
    </LayoutContainer>
  );
}
