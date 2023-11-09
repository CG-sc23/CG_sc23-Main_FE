import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { assert } from '@/libs/utils/assert';
import { css } from '@emotion/react';
import MDEditor, { ContextStore, RefMDEditor } from '@uiw/react-md-editor';
import rehypeVideo from 'rehype-video';
import { colors } from '../constant/color';

//! Dummy
const uploadImg = (_: any) =>
  new Promise<string>((resolve) =>
    setTimeout(
      () =>
        resolve(
          'https://velog.velcdn.com/images/greencloud/post/b5f233e1-628a-4771-bfdf-dbcdf64440a8/image.gif',
        ),
      1000,
    ),
  );
const uploadVideo = (_: any) =>
  new Promise<string>((resolve) =>
    setTimeout(
      () =>
        resolve(
          'https://velog.velcdn.com/images/ung7497/post/5790d720-b23a-48a9-930c-6550faf8735b/image.mov',
        ),
      1000,
    ),
  );

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

const dropFileUpload = async (file: File, ref: RefMDEditor) => {
  const notSupport = !/^(image|video)\/.+$/.test(file?.type);
  if (notSupport) {
    const fail = `\n![지원하는 파일 형식이 아닙니다!]()\n`;
    replaceSelection(ref, fail);
    return;
  }

  const blobUrl = URL.createObjectURL(file);

  const isImage = file.type.includes('image');
  const loadingMarkdown = isImage
    ? `\n![업로드 중...](${blobUrl})\n`
    : `\n<!--업로드 중...-->\n<video controls src="${blobUrl}" style="max-height: 640px;"></video>\n`;

  const initState = getStateFromTextArea(ref);
  const loadingState = replaceSelection(ref, loadingMarkdown);
  setSelectionRange(ref, {
    start: initState.selection.start,
    end: loadingState.selection.end,
  });

  try {
    const url = isImage ? await uploadImg(file) : await uploadVideo(file);
    const fileName = removeExtension(file.name);
    const insertedMarkdown = isImage
      ? `\n![${fileName}](${url})\n`
      : `\n<!--${fileName}-->\n${url}\n`;
    replaceSelection(ref, insertedMarkdown);

    return url;
  } catch (error) {
    // TODO HANDLE ERROR
    const errorMarkdown = '![에러!](...)';
    replaceSelection(ref, errorMarkdown);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
};

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
        accept=".jpg,.png,.jpeg,.jfif,.gif"
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
          previewOptions={{
            rehypePlugins: [[rehypeVideo, { details: false }]],
          }}
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
      <MDEditor.Markdown
        source={markdown}
        rehypePlugins={[[rehypeVideo as any, { details: false }]]}
      />
    </>
  );
}
