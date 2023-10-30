import FunnelSignUp from '@/components/Auth/FunnelSignUp';
import Card from '@/components/Card';
import { css } from '@emotion/react';

export default function SignUp() {
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
      <Card>
        <div
          css={css`
            width: 5rem;
            height: 5rem;
            background-color: aqua;
            margin: auto;
            border-radius: 50%;
          `}
        />
        <FunnelSignUp />
      </Card>
    </div>
  );
}
