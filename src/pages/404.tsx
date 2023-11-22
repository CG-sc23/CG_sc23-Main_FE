import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

const Container = styled.div<{ twinkle: boolean }>`
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 5rem;

  color: ${(props) => (props.twinkle ? 'white' : 'black')};
  background-color: ${(props) => (props.twinkle ? 'red' : 'white')};
`;

export default function TaskPage() {
  const [twinkle, setTwinkle] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setTwinkle((prev) => !prev), 100);

    return () => clearInterval(id);
  }, []);

  return <Container twinkle={twinkle}>404 NOT FOUND</Container>;
}
