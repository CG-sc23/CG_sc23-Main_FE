import { PropsWithChildren } from 'react';
import styled from '@emotion/styled';
import LoadingSpinner from './Spinner';

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  isLoading: boolean;
} & PropsWithChildren;
export default function CustomSuspense({ isLoading, children }: Props) {
  if (isLoading) {
    return (
      <LoadingWrapper>
        <LoadingSpinner />
      </LoadingWrapper>
    );
  }

  return <>{children}</>;
}
