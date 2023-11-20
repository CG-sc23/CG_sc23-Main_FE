import {
  type HTMLInputTypeAttribute,
  useState,
  type ChangeEvent,
  useEffect,
  useRef,
} from 'react';
import { css } from '@emotion/react';
import { useAnimation, motion } from 'framer-motion';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import { colors } from './constant/color';

type Props = {
  type: HTMLInputTypeAttribute;
  label: string;
  value: string;
  name?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: string;
  autoFocus?: boolean;
  readonly?: boolean;
};

const initialVariant = {
  x: 0,
  y: 0,
  scale: 1,
  color: colors.grey400,
};
const afterVariant = {
  x: 0,
  y: '-35px',
  scale: 0.8,
  color: colors.grey600,
};

const errorVariants = {
  initial: {
    opacity: 0.2,
    y: '-10px',
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

export default function InputWithLabel(props: Props) {
  const {
    type,
    value,
    label,
    onChange,
    error,
    name,
    autoFocus = true,
    readonly = false,
  } = props;
  const isPassword = type === 'password';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFocused, setIsFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const input = useRef<HTMLInputElement | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    setIsLoaded(true);

    if (autoFocus) {
      input.current?.focus();
      controls.start(afterVariant);
    }

    return () => controls.stop();
  }, [controls, autoFocus]);

  const handleFocus = () => {
    if (!isLoaded) return;

    setIsFocused(true);
    controls.start(afterVariant);
  };

  const handleBlur = () => {
    if (!isLoaded) return;
    if (value) return;

    setIsFocused(false);
    controls.start(initialVariant);
  };

  return (
    <div
      css={css`
        width: 100%;
        flex: 1;
        padding: 1rem 0 0 0;
      `}
    >
      <label
        css={css`
          position: relative;
          width: 100%;
        `}
      >
        <motion.span
          css={css`
            position: absolute;
            left: 0;
            bottom: 0;
            transform-origin: 0 0;
            font-weight: 600;
            text-align: left;
            z-index: 0;
            user-select: none;
            color: ${colors.grey400};
          `}
          initial={value ? afterVariant : initialVariant}
          animate={controls}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        >
          {label}
        </motion.span>
        <motion.input
          type={isPassword && isVisible ? 'text' : type}
          id={label}
          value={value}
          name={name}
          ref={input}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          readOnly={readonly}
          css={css`
            color: ${readonly ? colors.grey400 : colors.grey800};
            width: 100%;
            background-color: transparent;
            padding: 0 0 0.5rem;
            font-weight: 500;
            font-size: 1rem;
            border-radius: 1px;
            caret-color: ${error ? colors.red400 : colors.blue400};
            outline: none;
            border: 0 none;
            border-bottom: 2px solid ${error ? colors.red300 : colors.grey300};
            z-index: 10;
            :focus {
              border-bottom-color: ${error ? colors.red300 : colors.black};
            }
            transition:
              background-color 0.2s ease,
              border-color 0.2s ease;
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsVisible((prev) => !prev);
            }}
            css={css`
              position: absolute;
              right: 0;
              cursor: pointer;
            `}
          >
            {isVisible ? (
              <AiOutlineEyeInvisible
                css={css`
                  width: 1.25rem;
                  height: 1.25rem;
                  color: black;
                `}
              />
            ) : (
              <AiOutlineEye
                css={css`
                  width: 1.25rem;
                  height: 1.25rem;
                  color: black;
                `}
              />
            )}
          </button>
        )}
      </label>
      <motion.div
        variants={errorVariants}
        initial="initial"
        animate={error !== '' ? 'animate' : 'initial'}
        exit="initial"
        css={css`
          padding: 0.2rem 0;
          height: 1.5rem;
          font-size: 0.75rem;
          color: ${colors.red400};
        `}
      >
        {error}
      </motion.div>
    </div>
  );
}
