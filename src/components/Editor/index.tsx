import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { assert } from '@/libs/utils/assert';
import { css } from '@emotion/react';
import MDEditor, { ContextStore, RefMDEditor } from '@uiw/react-md-editor';
import { colors } from '../constant/color';

import client from '@/api/client';
import { safeLocalStorage } from '@toss/storage';
import { queryKey } from '@/libs/constant';
import { uploadImg } from '@/libs/utils/s3';

//! Utils
interface TextRange {
  start: number;
  end: number;
}
interface TextState {
  text: string;
  selectedText: string;
  selection: TextRange;
}

function removeExtension(filename: string) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return filename;
  return filename.substring(0, lastDotIndex);
}

function getStateFromTextArea(ref: RefMDEditor): TextState {
  const textArea = ref.current?.textarea;
  assert(textArea, 'No TextArea');

  return {
    selection: {
      start: textArea.selectionStart,
      end: textArea.selectionEnd,
    },
    text: textArea.value,
    selectedText: textArea.value?.slice(
      textArea.selectionStart,
      textArea.selectionEnd,
    ),
  };
}

function replaceSelection(ref: RefMDEditor, text: string): TextState {
  const current = ref.current;
  assert(current, 'No ref');

  const commandOrchestrator = current.commandOrchestrator;
  assert(commandOrchestrator, 'No command');

  return commandOrchestrator.textApi.replaceSelection(text);
}

function setSelectionRange(ref: RefMDEditor, range: TextRange): TextState {
  const current = ref.current;
  assert(current, 'No ref');

  const commandOrchestrator = current.commandOrchestrator;
  assert(commandOrchestrator, 'No command');

  return commandOrchestrator.textApi.setSelectionRange(range);
}

// ! DROP FILE UPLOAD
const dropFileUpload = async (file: File, ref: RefMDEditor) => {
  // ! REMOVE TOKEN
  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
  assert(token, 'No Token');

  const notSupport = !/^(image)\/.+$/.test(file?.type);
  if (notSupport) {
    const fail = `\n![지원하는 파일 형식이 아닙니다!]()\n`;
    replaceSelection(ref, fail);
    return;
  }

  const blobUrl = URL.createObjectURL(file);

  const loadingMarkdown = `\n![업로드 중...](${blobUrl})\n`;

  const initState = getStateFromTextArea(ref);
  const loadingState = replaceSelection(ref, loadingMarkdown);
  setSelectionRange(ref, {
    start: initState.selection.start,
    end: loadingState.selection.end,
  });

  try {
    const url = await uploadImg({
      file,
      filename: file.name,
      token,
    });
    const fileName = removeExtension(file.name);
    const insertedMarkdown = `\n![${fileName}](${url})\n`;
    replaceSelection(ref, insertedMarkdown);

    return url;
  } catch (error) {
    const errorMarkdown = '![에러!](...)';
    replaceSelection(ref, errorMarkdown);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
};

function extractImageLinks(markdownText: string): string[] {
  const regex = /!\[.*?\]\((.*?)\)/g;
  let matches;
  const links: string[] = [];

  while ((matches = regex.exec(markdownText)) !== null) {
    links.push(matches[1]);
  }

  return links;
}

// * Component
export default function Editor() {
  const [preview, setPreview] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [highlight, setHighlight] = useState(false);
  const editorRef = useRef<RefMDEditor>(null);

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
        return await dropFileUpload(files[0], ref);
      } catch (error) {
        // TODO HANDLE ERROR
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
        {!preview && highlight ? (
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
      <button
        type="button"
        onClick={() => console.log(extractImageLinks(markdown))}
      >
        TEST
      </button>
      <MDEditor.Markdown source={markdown} />
    </>
  );
}
