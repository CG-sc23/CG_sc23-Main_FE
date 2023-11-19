import { colors } from "@/components/constant/color";

type ProjectStatus = {
  text: string;
  color: string;
};

export function myProjectStatus(provider: string): ProjectStatus {
  const strategies = {
    in_progress: {
      text: "진행중",
      color: colors.green500,
    },
    completed: {
      text: "프로젝트 종료",
      color: colors.red500,
    },
    terminated: {
      text: "프로젝트 포기",
      color: colors.grey500,
    },
    default: {
      text: "오류",
      color: colors.grey500,
    },
  } as const;
  return strategies[provider as keyof typeof strategies] ?? strategies.default;
}
