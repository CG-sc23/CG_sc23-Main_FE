import FunnelSignUp from '@/components/Auth/FunnelSignUp';
import { css } from '@emotion/react';

export default function About() {
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
      <FunnelSignUp />
    </div>
  );
}
