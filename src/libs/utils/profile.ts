export function mySingupStrategy(provider: string): string {
  const strategies = {
    our: '직접 회원 가입',
    naver: '네이버 간편 가입',
    kakao: '카카오 간편 가입',
    default: '직접 회원 가입',
  } as const;
  return strategies[provider as keyof typeof strategies] ?? '알 수 없는 값';
}
