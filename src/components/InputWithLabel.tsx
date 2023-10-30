import {
  type Dispatch,
  type HTMLInputTypeAttribute,
  type SetStateAction,
  useState,
} from 'react';
import { css } from '@emotion/react';
import { useAnimation, motion } from 'framer-motion';

import { colors } from './constant/color';

type Props = {
  type: HTMLInputTypeAttribute;
  label: string;
  // eslint-disable-next-line react/require-default-props
  value?: string;
  setter: Dispatch<SetStateAction<string>>;
};

const initialVariant = { x: 0, y: -5, scale: 1, color: colors.grey400 };
const afterVariant = { x: -5, y: -50, scale: 0.8, color: colors.grey600 };

export default function InputWithLabel(props: Props) {
  const { type, value, label, setter } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFocused, setIsFocused] = useState(false);
  const controls = useAnimation();

  const handleFocus = () => {
    setIsFocused(true);
    controls.start(afterVariant);
  };

  const handleBlur = () => {
    if (value) return;
    setIsFocused(false);
    controls.start(initialVariant);
  };

  return (
    <label
      css={css`
        position: relative;
      `}
    >
      <motion.span
        css={css`
          position: absolute;
          bottom: 0;
          font-weight: 500;
          color: ${colors.grey400};
        `}
        initial={value ? afterVariant : initialVariant}
        animate={controls}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
      >
        {label}
      </motion.span>
      <motion.input
        type={type}
        id={label}
        value={value}
        onChange={(e) => setter(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        css={css`
          color: ${colors.grey800};
          /* height: 44px; */
          width: 100%;

          padding: 0 0 4px;
          font-weight: 500;
          font-size: 28px;
          border-radius: 1px;
          caret-color: ${colors.blue400};
          outline: none;
          border: 0 none;
          border-bottom: 2px solid ${colors.grey300};
          :focus {
            border-bottom-color: ${colors.blue400};
          }
          transition: background-color 0.2s ease;
        `}
      />
    </label>
  );
}
