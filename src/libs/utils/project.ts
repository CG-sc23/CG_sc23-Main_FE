import { colors } from "@/components/constant/color";
import { ProjectStatus } from "../type/client";

type ReturnProjectStatus = {
  text: string;
  color: string;
};
type Strategies = {
  [key in ProjectStatus]: ReturnProjectStatus;
};
export function myProjectStatus(provider: ProjectStatus, name: string) {
  const strategies: Strategies = {
    READY: {
      text: "시작 대기",
      color: colors.blue500,
    },
    IN_PROGRESS: {
      text: "진행 중",
      color: colors.green500,
    },
    COMPLETED: {
      text: `${name} 완료`,
      color: colors.yellow500,
    },
    TERMINATED: {
      text: `${name} 포기`,
      color: colors.grey500,
    },
  } as const;
  return strategies[provider as keyof typeof strategies];
}

type DDayResult = {
  sign: "PLUS" | "MINUS";
  day: number;
};

export function calculateDDay(
  created_at: string,
  ended_at: string
): DDayResult {
  const startDate = new Date(created_at);
  const endDate = new Date(ended_at);

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (startDate > endDate) {
    return { sign: "MINUS", day: diffDays };
  } else {
    return { sign: "PLUS", day: diffDays };
  }
}
