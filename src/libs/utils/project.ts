import { colors } from '@/components/constant/color';
import {
  MilestoneStatus,
  ProjectStatus,
  TaskGroupStatus,
} from '../type/client';

type ReturnProjectStatus = {
  text: string;
  color: string;
};
type ProjectStrategies = {
  [key in ProjectStatus]: ReturnProjectStatus;
};
export function myProjectStatus(provider: ProjectStatus) {
  const strategies: ProjectStrategies = {
    READY: {
      text: '시작 대기',
      color: colors.blue500,
    },
    IN_PROGRESS: {
      text: '진행 중',
      color: colors.green500,
    },
    COMPLETED: {
      text: `프로젝트 완료`,
      color: colors.yellow500,
    },
    TERMINATED: {
      text: '프로젝트 포기',
      color: colors.red500,
    },
  } as const;
  return strategies[provider as keyof typeof strategies];
}

type MileStoneStrategies = {
  [key in MilestoneStatus]: ReturnProjectStatus;
};
export function myMileStoneStatus(provider: MilestoneStatus) {
  const strategies: MileStoneStrategies = {
    IN_PROGRESS: {
      text: '진행 중',
      color: colors.green500,
    },
    COMPLETED: {
      text: `마일스톤 완료`,
      color: colors.yellow500,
    },
  } as const;
  return strategies[provider as keyof typeof strategies];
}
type TaskGroupStrategies = {
  [key in TaskGroupStatus]: ReturnProjectStatus;
};
export function myTaskGroupStatus(provider: TaskGroupStatus) {
  const strategies: TaskGroupStrategies = {
    READY: {
      text: '시작 대기',
      color: colors.blue500,
    },
    IN_PROGRESS: {
      text: '진행 중',
      color: colors.green500,
    },
    COMPLETED: {
      text: `태스크그룹 완료`,
      color: colors.yellow500,
    },
  } as const;
  return strategies[provider as keyof typeof strategies];
}

type DDayResult = {
  sign: 'PLUS' | 'MINUS';
  day: number;
};

export function calculateDDay(
  created_at: string,
  ended_at: string,
  ___: boolean = false,
): DDayResult {
  const startDate = ___ ? new Date() : new Date(created_at);
  const endDate = new Date(ended_at);

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (startDate < endDate) {
    return { sign: 'MINUS', day: diffDays };
  } else {
    return { sign: 'PLUS', day: diffDays };
  }
}
