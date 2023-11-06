import FunnelSignUp from '@/components/Auth/FunnelSignUp';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const Container = styled.div`
  position: relative;
  padding: 2rem 4rem;
  max-width: 500px;

  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  width: 500px;

  box-shadow: 1px 13px 48px -3px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 1px 13px 48px -3px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 1px 13px 48px -3px rgba(0, 0, 0, 0.3);
`;

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
      <Container>
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
      </Container>
    </div>
  );
}
