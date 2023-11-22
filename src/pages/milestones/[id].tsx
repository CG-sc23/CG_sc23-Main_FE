import styled from "@emotion/styled";
import { bpmax } from "@/libs/styles/constants";
import Card from "@/components/Card";

const Container = styled.div`
  width: 896px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* mobile */
  ${bpmax[0]} {
    width: 100%;
    padding: 0;
  }
`;

const Header = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

export default function MilestoneDetail() {
  return (
    <Container>
      <Card>
        <Header>{"subject"}</Header>
      </Card>
    </Container>
  );
}
