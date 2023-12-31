import { bpmax, bpmin } from '@/libs/styles/constants';
import styled from '@emotion/styled';
import Link from 'next/link';
import { colors } from '../constant/color';
import ConditionalRendering from '../ConditionalRendering';
import { css } from '@emotion/react';

// [Layer] Project > Milestone > Task Group > Task
// TODO : Milestone UI

const Container = styled(Link)`
  box-sizing: border-box;
  position: relative;
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

const Button = styled.button<{ hoverColor?: string; disabledColor?: string }>`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${(props) => props.color || colors.red600};

  font-size: 1.2rem;
  font-weight: 500;

  border-radius: 0.2rem;
  text-align: center;

  padding: 0.5rem 1rem;

  color: ${colors.white};

  cursor: pointer;

  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${(props) => props.hoverColor || colors.red400};
  }
  &:disabled {
    background-color: ${(props) => props.disabledColor || colors.blue200};
    cursor: not-allowed;
  }
`;

type Props = {
  id: number;
  subject: string;
  tags: string[];
  hasDeleteButton?: boolean;
  onDelete?: () => Promise<void>;
};
export function Milestone({
  id,
  subject,
  tags,
  hasDeleteButton = false,
  onDelete,
}: Props) {
  return (
    <div
      css={css`
        position: relative;
        width: 100%;
      `}
    >
      <Container
        href={`/milestones/${id}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Header>{subject}</Header>
        <TagWrapper>
          {tags.map((tag) => (
            <Tag key={`${id}_${tag}`}>{tag}</Tag>
          ))}
        </TagWrapper>
      </Container>
      <ConditionalRendering condition={hasDeleteButton}>
        <Button onClick={onDelete}>x</Button>
      </ConditionalRendering>
    </div>
  );
}
