/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
import { assert } from '@/libs/utils/assert';
import {
  Children,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
} from 'react';
import { NonEmptyArray } from '@toss/utils';

export interface FunnelProps<Steps extends NonEmptyArray<string>> {
  steps: Steps;
  step: Steps[number];
  children:
    | Array<ReactElement<StepProps<Steps>>>
    | ReactElement<StepProps<Steps>>;
}

export function Funnel<Steps extends NonEmptyArray<string>>({
  steps,
  step,
  children,
}: FunnelProps<Steps>) {
  const validChildren = Children.toArray(children)
    .filter(isValidElement)
    .filter((i) =>
      steps.includes((i.props as Partial<StepProps<Steps>>).name ?? ''),
    ) as Array<ReactElement<StepProps<Steps>>>;

  const targetStep = validChildren.find((child) => child.props.name === step);

  assert(targetStep != null, `${step} 스텝 컴포넌트를 찾지 못했습니다.`);

  return <>{targetStep}</>;
}

export interface StepProps<Steps extends NonEmptyArray<string>> {
  name: Steps[number];
  onEnter?: () => void;
  children: ReactNode;
}

export function Step<T extends NonEmptyArray<string>>({
  onEnter,
  children,
}: StepProps<T>) {
  useEffect(() => {
    onEnter?.();
  }, [onEnter]);

  return <>{children}</>;
}
