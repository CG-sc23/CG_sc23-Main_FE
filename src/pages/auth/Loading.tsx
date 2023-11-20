import useSocialAuth from '@/hooks/auth/useSocialAuth';
import LayoutContainer from '@/components/Auth/LayoutContainer';
import LoadingSpinner from '@/components/Spinner';

export default function Loading() {
  const { error } = useSocialAuth();

  return (
    <LayoutContainer>
      <LoadingSpinner />
      {error && <div>{error}</div>}
    </LayoutContainer>
  );
}
