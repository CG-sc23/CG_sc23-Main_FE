import styled from '@emotion/styled';
import Link from 'next/link';
import { colors } from '../constant/color';
import { css } from '@emotion/react';
import { formatDate } from '@/libs/utils';
import ConditionalRendering from '../ConditionalRendering';

// [Layer] Project > Milestone > Task Group > Task
// TODO : Task UI

const Container = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  transition: 0.2s;
  box-sizing: border-box;
  &:hover {
    transform: scale(1.02);
    background-color: ${colors.grey200};
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 500;
`;

const PulicOrNot = styled.div`
  color: red;
`;

const TagWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Tag = styled.div`
  padding: 0.5rem 1rem;
  border: 1px solid ${colors.grey400};
  border-radius: 0.2rem;
  font-size: 0.8rem;
`;

type Props = {
  title: string;
  id: number;
  created_at: string;
  tags: string[];
  is_public?: boolean;
};

export function Task({ title, id, created_at, tags, is_public = true }: Props) {
  return (
    <Container href={`/tasks/${id}`}>
      <TitleWrapper>
        <Title>{title}</Title>
        {!is_public ? <PulicOrNot>비공개</PulicOrNot> : null}
      </TitleWrapper>
      <span
        css={css`
          font-size: 0.8rem;
          color: ${colors.grey400};
        `}
      >
        {formatDate(created_at)}
      </span>
      <TagWrapper>
        {tags.map((tag) => (
          <Tag>{tag}</Tag>
        ))}
      </TagWrapper>
    </Container>
  );
}
