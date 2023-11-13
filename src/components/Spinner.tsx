// Spinner.js
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// 스피너 애니메이션 정의
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// 스피너 스타일 컴포넌트
const Spinner = styled.div`
  border: 5px solid rgba(255, 255, 255, 0.3); // 반투명 테두리
  border-top: 5px solid blue; // 상단 색상
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 2s linear infinite;
`;

export default function LoadingSpinner() {
  return <Spinner />;
}
