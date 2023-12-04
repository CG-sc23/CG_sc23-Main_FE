import { bpmax } from '@/libs/styles/constants';
import styled from '@emotion/styled';

const FooterWrapper = styled.div`
  width: 100%;
`;

const Container = styled.div`
  width: 100%;
  height: 12rem;
  margin-top: 2rem;
  z-index: 20;

  background-color: black;
`;

export function Footer() {
  return (
    <FooterWrapper>
      <Container>
        <h2>광고주</h2>
      </Container>
    </FooterWrapper>
  );
}
