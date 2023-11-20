// import Card from '@/components/Card';
import client from '@/api/client';
import useSignOut from '@/hooks/auth/useSignOut';
import { queryKey } from '@/libs/constant';
import { css } from '@emotion/react';
import { safeLocalStorage } from '@toss/storage';
import Link from 'next/link';
// import { colors } from '@/components/constant/color';
// import InputWithLabel from '@/components/InputWithLabel';

export default function Home() {
  const { signOut } = useSignOut();
  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);

  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `}
    >
      <Link href="/auth/SignIn">SignIn</Link>
      <Link href="/auth/SignUp">SignUp</Link>
      <button
        type="button"
        onClick={() => {
          console.log('SIGN OUT');
          signOut();
        }}
      >
        Sign Out
      </button>
      <button
        type="button"
        onClick={async () => {
          console.log('UPDATE STATUS');
          if (!token) return;
          const res = await client.gitHubUpdateStatus({ token });
          console.log(res);
        }}
      >
        UPDATE STATUS
      </button>
      <button
        type="button"
        onClick={async () => {
          console.log('STACK');
          const res = await client.gitHubStack({ user_id: '3' });
          console.log(res);
        }}
      >
        STACK
      </button>
      <button
        type="button"
        onClick={async () => {
          console.log('KEYWORD');
          const res = await client.gitHubKeyword({ user_id: '3' });
          console.log(res);
        }}
      >
        KEYWORD
      </button>
      <button
        type="button"
        onClick={async () => {
          console.log('MANUAL_UPDATE');
          if (!token) return;
          const res = await client.gitHubManualUpdate({ token });
          console.log(res);
        }}
      >
        MANUAL_UPDATE
      </button>
      <button
        type="button"
        onClick={async () => {
          console.log('COMMON_STACK');

          const res = await client.commonStack({ stack: 'Shell' });
          console.log(res);
        }}
      >
        COMMON STACK
      </button>
      <button
        type="button"
        onClick={async () => {
          console.log('USER_DETAIL');

          const res = await client.userDetail({ user_id: '3' });
          console.log(res);
        }}
      >
        USER_DETAIL
      </button>
    </div>
  );
}
