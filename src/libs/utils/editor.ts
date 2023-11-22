import type { RefMDEditor, TextAreaTextApi } from '@uiw/react-md-editor';
import { assert } from './assert';
import { uploadImg } from './s3';

interface TextRange {
  start: number;
  end: number;
}
interface TextState {
  text: string;
  selectedText: string;
  selection: TextRange;
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

function removeExtension(filename: string) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return filename;
  return filename.substring(0, lastDotIndex);
}

type InputChangeUpload = {
  token: string;
  file: File;
  api: TextAreaTextApi;
};
export const inputChangeUpload = async ({
  api,
  file,
  token,
}: InputChangeUpload) => {
  if (!token) return;
  const notSupport = !/^(image)\/.+$/.test(file?.type);
  if (notSupport) {
    const fail = `\n![지원하는 파일 형식이 아닙니다!]()\n`;
    api.replaceSelection(fail);
    return;
  }

  const blobUrl = URL.createObjectURL(file);
  const imageStyle =
    '<!--rehype:style=display: flex; justify-content: center; width: 100%; max-width: 500px; margin: auto; margin-top: 4px; margin-bottom: 4px; -->';

  const loadingMarkdown = `\n![업로드 중...](${blobUrl})\n${imageStyle}\n`;

  const initialState = api.replaceSelection('');
  const loadingState = api.replaceSelection(loadingMarkdown);

  api.setSelectionRange({
    start: initialState.selection.start,
    end: loadingState.selection.end,
  });

  try {
    const url = await uploadImg({
      file,
      filename: file.name,
      token,
    });
    const fileName = removeExtension(file.name);
    const insertedMarkdown = `\n![${fileName}](${url})\n${imageStyle}\n`;
    api.replaceSelection(insertedMarkdown);

    return url;
  } catch (error) {
    const errorMarkdown = '![에러!](...)';
    api.replaceSelection(errorMarkdown);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
};

type DropFileUpload = {
  file: File;
  ref: RefMDEditor;
  token: string;
};
export const dropFileUpload = async ({ file, ref, token }: DropFileUpload) => {
  assert(token, 'No Token');

  const notSupport = !/^(image)\/.+$/.test(file?.type);
  if (notSupport) {
    const fail = `\n![지원하는 파일 형식이 아닙니다!]()\n`;
    replaceSelection(ref, fail);
    return;
  }

  const blobUrl = URL.createObjectURL(file);
  const imageStyle =
    '<!--rehype:style=display: flex; justify-content: center; width: 100%; max-width: 500px; margin: auto; margin-top: 4px; margin-bottom: 4px; -->';

  const loadingMarkdown = `\n![업로드 중...](${blobUrl})\n${imageStyle}\n`;

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
    const insertedMarkdown = `\n![${fileName}](${url})\n${imageStyle}\n`;
    replaceSelection(ref, insertedMarkdown);

    return url;
  } catch (error) {
    const errorMarkdown = '![에러!](...)';
    replaceSelection(ref, errorMarkdown);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
};

export function extractImageLinks(markdownText: string): string[] {
  const regex = /!\[.*?\]\((.*?)\)/g;
  let matches;
  const links: string[] = [];

  while ((matches = regex.exec(markdownText)) !== null) {
    links.push(matches[1]);
  }

  return links;
}
