import { bpmax, bpmin } from "@/libs/styles/constants";
import styled from "@emotion/styled";
import Link from "next/link";
import { colors } from "../constant/color";

// [Layer] Project > Milestone > Task Group > Task
// TODO : Milestone UI

const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  border-top: 2px solid ${colors.grey200};
  ${bpmax[0]} {
    padding: 2rem 0.2rem;
  }
  ${bpmin[0]} {
    padding: 1rem;
    transition: 0.2s;
    &:hover {
      cursor: pointer;
      transform: scale(1.02);
      background-color: ${colors.grey200};
    }
  }
`;

const Header = styled.h2`
  width: 100%;
  font-size: 1.2rem;
  font-weight: 600;
`;

const TagWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 0.2rem;
  background-color: ${colors.grey300};
  color: black;
`;

type Props = {
  id: number;
  subject: string;
  tags: string[];
};

export function Milestone({ id, subject, tags }: Props) {
  return (
    <Container href={`/milestones/${id}`}>
      <Header>{subject}</Header>
      <TagWrapper>
        {tags.map((tag) => (
          <Tag>{tag}</Tag>
        ))}
      </TagWrapper>
    </Container>
  );
}
