import LayoutContainer from '@/components/Auth/LayoutContainer';
import dynamic from 'next/dynamic';

const FunnelSignUp = dynamic(() => import('@/components/Auth/FunnelSignUp'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function SignUp() {
  return (
    <LayoutContainer>
      <FunnelSignUp />
    </LayoutContainer>
  );
}
