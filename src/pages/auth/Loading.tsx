import useSocialAuth from '@/hooks/auth/useSocialAuth';

export default function Loading() {
  const { error } = useSocialAuth();

  return (
    <>
      <div>Loading</div>
      {error && <div>{error}</div>}
    </>
  );
}
