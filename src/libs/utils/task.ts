// 태스크 생성 권한
export const taskCreationPermitted = (permission: string | undefined) => {
  const strategies = {
    OWNER: {
      permit: true,
    },
    MANAGER: {
      permit: true,
    },
    MEMBER: {
      permit: false,
    },
    NOTHING: {
      permit: false,
    },
    DEFAULT: {
      permit: false,
    },
    undefined: {
      permit: false,
    },
  } as const;

  return (
    strategies[permission as keyof typeof strategies].permit ??
    strategies.DEFAULT.permit
  );
};
