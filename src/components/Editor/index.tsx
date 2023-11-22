import {
  ChangeEvent,
  Dispatch,
  DragEvent,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react';

import { css } from '@emotion/react';
import MDEditor, {
  ContextStore,
  ExecuteState,
  ICommand,
  RefMDEditor,
  TextAreaTextApi,
} from '@uiw/react-md-editor';
// const MDEditor = dynamic(() => import('@uiw/react-md-editor'));

import { safeLocalStorage } from '@toss/storage';
import { queryKey } from '@/libs/constant';

import { colors } from '@/components/constant/color';
import { dropFileUpload, inputChangeUpload } from '@/libs/utils/editor';
import dynamic from 'next/dynamic';

const imgUpload = (
  inputRef: RefObject<HTMLInputElement>,
  textAPIRef: MutableRefObject<TextAreaTextApi | undefined>,
) => ({
  name: 'Text To Image',
  keyCommand: 'text2image',
  render: (
    command: ICommand,
    disabled: boolean,
    executeCommand: (command: ICommand, name?: string) => void,
  ) => {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          executeCommand(command, command.groupName);
        }}
      >
        <svg width="12" height="12" viewBox="0 0 20 20">
          <path
            fill="currentColor"
            d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
          ></path>
        </svg>
      </button>
    );
  },
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    if (!inputRef?.current) return;
    inputRef.current.click();
    textAPIRef.current = api;
  },
});

export const editorCommands = (
  inputRef: RefObject<HTMLInputElement>,
  textAPIRef: MutableRefObject<TextAreaTextApi | undefined>,
) => [imgUpload(inputRef, textAPIRef)];

// * Component
type EditorProps = {
  markdown: string;
  setMarkdown: Dispatch<SetStateAction<string>>;
  height?: number | string;
  visibleDragbar?: boolean;
  hiddenPreviewButton?: boolean;
  maxHeight?: number;
  minHeight?: number;
  placeholder?: string;
};
export default function Editor({
  markdown,
  setMarkdown,
  hiddenPreviewButton = false,
  height = 300,
  visibleDragbar = true,
  maxHeight,
  minHeight,
  placeholder = '',
}: EditorProps) {
  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN) || '';
  const [preview, setPreview] = useState(false);
  const [highlight, setHighlight] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<TextAreaTextApi>();
  const editorRef = useRef<RefMDEditor>(null);

  const isPreviewVisible = !preview && highlight;

  function onChange(
    value?: string | undefined,
    event?: ChangeEvent<HTMLTextAreaElement> | undefined,
    state?: ContextStore | undefined,
  ) {
    setMarkdown(value as string);
  }

  async function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const {
      target: { files },
    } = e;
    if (!files || !files[0]) return;
    if (!token) return;
    if (!textRef?.current) return;
    await inputChangeUpload({
      token,
      api: textRef.current,
      file: files[0],
    });
  }

  const onStartDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (preview) return;
    setHighlight(true);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setHighlight(true);
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setHighlight(false);
  };

  const onDrop = (ref: RefMDEditor) => {
    return async (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const {
        dataTransfer: { files },
      } = event;

      try {
        await dropFileUpload({ file: files[0], ref, token });
      } catch (error) {
        console.error(error);
      } finally {
        setHighlight(false);
      }
    };
  };

  return (
    <>
      <input
        css={css`
          display: none;
        `}
        type="file"
        accept=".jpg,.png,.jpeg,.gif"
        ref={inputRef}
        onChange={onInputChange}
      />
      <div
        css={css`
          position: relative;
          width: 100%;
          height: 100%;
        `}
        onDragEnter={onStartDragEnter}
        data-color-mode="light"
      >
        <MDEditor
          ref={editorRef}
          value={markdown}
          onChange={onChange}
          visibleDragbar={visibleDragbar}
          height={height}
          minHeight={minHeight}
          maxHeight={maxHeight}
          preview={preview ? 'preview' : 'edit'}
          commands={editorCommands(inputRef, textRef)}
          extraCommands={[]}
          textareaProps={{
            placeholder: placeholder,
          }}
          css={css`
            border-radius: 5px;
            transition: border 0.1s ease;
            &:focus {
              outline: none;
              border: 1px solid black;
            }
          `}
        />
        {isPreviewVisible ? (
          <div
            css={css`
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              transition:
                background-color 0.2s ease,
                opacity 0.2s ease;
              background-color: ${highlight ? colors.blue100 : 'transparent'};
              opacity: ${highlight ? 0.1 : 0};
            `}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop(editorRef)}
          />
        ) : null}
        {hiddenPreviewButton ? null : (
          <button
            type="button"
            onClick={() => setPreview((prev) => !prev)}
            css={css`
              position: absolute;
              right: 0px;
              top: 0px;

              width: 80px;
              height: 30px;
              padding: 5px;

              background-color: white;
              border: 1px solid ${colors.black};
              border-radius: 5px;

              text-align: center;
              font-weight: bold;
              color: ${colors.black};

              transition: color 0.2s ease;
              cursor: pointer;

              &:hover {
                color: ${colors.grey500};
              }
            `}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        )}
      </div>
    </>
  );
}
