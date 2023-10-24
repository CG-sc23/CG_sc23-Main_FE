import Link from 'next/link';
import { useEffect } from 'react';

import client from '@/api/client';

async function test() {
  try {
    const { data: resSignUp } = await client.signUp({
      description: 'asdf',
      email: 'ung@naver.com',
      name: 'unghee',
      password: 'asdf',
      short_description: 'asdf',
    });

    // eslint-disable-next-line no-console
    console.log('signup : ', resSignUp);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

export default function Home() {
  useEffect(() => {
    test();
  }, []);

  return (
    <nav>
      <Link href="/about">About</Link>
    </nav>
  );
}
