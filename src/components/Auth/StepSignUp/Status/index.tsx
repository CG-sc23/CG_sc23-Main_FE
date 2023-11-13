import { StatusType } from '@/hooks/auth/useSignUpFunnel';
import SignUpSuccess from './Success';
import SignUpFail from './Fail';

type StatusProps = {
  status: StatusType;
};

export default function Status({ status }: StatusProps) {
  if (status === 'loading') return null;

  if (status === 'fulfilled') return <SignUpSuccess />;

  if (status === 'rejected') return <SignUpFail />;
}
