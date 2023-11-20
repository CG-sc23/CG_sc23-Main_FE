import { css } from '@emotion/react';
import { ChangeEvent, useState, KeyboardEvent, useRef } from 'react';
import { colors } from '@/components/constant/color';

const dummyKeywordRecommend = (str: string) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(str + ' recommend'), 100);
  });

export default function ProjectHome() {
  const [keyword, setKeyword] = useState('');
  const [recommend, setRecommend] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const [left, setLeft] = useState(0);

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    if (value === '') {
      setRecommend('');
      return;
    }

    const res = await dummyKeywordRecommend(value);
    setRecommend(res as string);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (recommend && inputRef.current && divRef.current) {
        setKeyword(recommend);
        setRecommend('');
        console.log(inputRef.current?.selectionEnd);
        inputRef.current?.focus();
        inputRef.current?.setSelectionRange(recommend.length, recommend.length);
        setLeft(inputRef.current.scrollWidth);

        inputRef.current?.scrollIntoView({
          behavior: 'auto',
          block: 'end',
          inline: 'end',
        });
      }
    }
  };

  return (
    <div
      css={css`
        position: relative;
      `}
    >
      <input
        ref={inputRef}
        value={keyword}
        onChange={onChange}
        onKeyDown={onKeyDown}
        css={css`
          background: none;
          border: none;
          text-indent: none;
          letter-spacing: normal;
          font-weight: 400;

          border-bottom: 1px solid black;

          position: relative;
          font-size: 1rem;
          padding: 0.5rem 1rem;
          width: 100%;
        `}
      />
      <div
        ref={divRef}
        css={css`
          position: absolute;
          top: 0;
          left: 0;
          font-size: 1rem;
          letter-spacing: normal;
          font-weight: 400;

          color: ${colors.grey400};
          opacity: 0.8;
          background-color: transparent;
          pointer-events: none;
          width: 100%;
          padding: 0.5rem 1rem;

          white-space: nowrap;
          text-overflow: ellipsis;

          z-index: -1;
        `}
      >
        {keyword && recommend.startsWith(keyword) ? recommend : ''}
      </div>
    </div>
  );
}
