import {
  ChangeEvent,
  Dispatch,
  DragEvent,
  SetStateAction,
  useRef,
  useState,
} from 'react';

import { css } from '@emotion/react';
import MDEditor, { ContextStore, RefMDEditor } from '@uiw/react-md-editor';

import { safeLocalStorage } from '@toss/storage';
import { queryKey } from '@/libs/constant';

import { colors } from '@/components/constant/color';
import { dropFileUpload } from '@/libs/utils/editor';

// * Component
type EditorProps = {
  markdown: string;
  setMarkdown: Dispatch<SetStateAction<string>>;
};
export default function Editor({ markdown, setMarkdown }: EditorProps) {
  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN) || '';
  const [preview, setPreview] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const editorRef = useRef<RefMDEditor>(null);

  const isPreviewVisible = !preview && highlight;

  function onChange(
    value?: string | undefined,
    event?: ChangeEvent<HTMLTextAreaElement> | undefined,
    state?: ContextStore | undefined,
  ) {
    setMarkdown(value as string);
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
      />
      <div
        css={css`
          position: relative;
          width: 100%;
        `}
        onDragEnter={onStartDragEnter}
        data-color-mode="light"
      >
        <MDEditor
          ref={editorRef}
          value={markdown}
          onChange={onChange}
          hideToolbar
          visibleDragbar
          height={300}
          minHeight={200}
          maxHeight={500}
          preview={preview ? 'preview' : 'edit'}
          css={css`
            border-radius: 5px;
            transition: border 0.1s ease;
            &:focus {
              outline: 1px solid blue;
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
        <button
          type="button"
          onClick={() => setPreview((prev) => !prev)}
          css={css`
            position: absolute;
            right: 0;
            top: 0;
          `}
        >
          preview
        </button>
      </div>
    </>
  );
}
