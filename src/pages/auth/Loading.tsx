import useSocialAuth from '@/hooks/auth/useSocialAuth';
import LayoutContainer from '@/components/Auth/LayoutContainer';

export default function Loading() {
  const { error } = useSocialAuth();

  return (
    <LayoutContainer>
      <div>Loading</div>
      {error && <div>{error}</div>}
    </LayoutContainer>
  );
}
