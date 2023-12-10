import {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import MDEditor from '@uiw/react-md-editor';

import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { colors } from '@/components/constant/color';
import { bpmax } from '@/libs/styles/constants';
import useSnackBar from '@/hooks/useSnackBar';
import Editor from '@/components/Editor';
import useUser from '@/hooks/user/useUser';
import client from '@/api/client';
import { extractImageLinks } from '@/libs/utils/editor';
import { useRouter } from 'next/router';
import Switch from 'react-switch';
import useGetTask from '@/hooks/task/useGetTask';

const Container = styled.div`
  position: relative;
  box-sizing: border-box;

  width: 100vw;
  height: 100vh;

  display: flex;

  overflow: hidden;
`;

const EditorSection = styled.div`
  width: 50%;
  height: 100%;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;

  padding: 1rem;

  overflow-y: hidden;

  background-color: ${colors.white};

  ${bpmax[3]} {
    width: 100%;
  }
`;
const TitleInputWrapper = styled.div`
  height: 100px;
`;
const TitleInput = styled.input`
  border: none;
  outline: none;
  background: none;

  width: 100%;
  padding: 1rem 0;

  font-size: 3rem;
  font-weight: 900;

  background-color: ${colors.white};

  &::placeholder {
    color: ${colors.grey500};
  }
`;
const TitleDiv = styled.div`
  width: 70px;
  height: 10px;
  background-color: ${colors.grey800};
`;
const TagInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  align-items: flex-start;
  gap: 5px;

  min-height: 36px;

  padding: 0.5rem 0;
`;
const Tag = styled.span`
  font-weight: 300;
  background-color: ${colors.grey50};
  color: ${colors.green400};

  border-radius: 9999px;
  padding: 10px 15px;

  user-select: none;
  cursor: pointer;

  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.grey200};
  }
`;
const TagInput = styled.input`
  border: none;
  outline: none;
  background: none;

  width: 200px;

  font-size: 1.5rem;
  font-weight: 300;

  background-color: ${colors.white};
`;
const EditorWrapper = styled.div`
  position: relative;
  flex: 1;

  min-height: 300px;
`;

const PreviewSection = styled.div`
  width: 50%;
  height: 100%;
  box-sizing: border-box;

  padding: 5rem 2rem;

  overflow-y: auto;

  ${bpmax[3]} {
    display: none;
  }
`;
const Title = styled.h1`
  height: 5rem;

  font-size: 3rem;
  font-weight: bold;
`;
const PreviewWrapper = styled.div``;
const SubmitBar = styled.div`
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;

  background-color: ${colors.grey50};

  box-shadow: 1px -4px 18px -3px rgba(56, 56, 56, 0.75);
  -webkit-box-shadow: 1px -4px 18px -3px rgba(56, 56, 56, 0.75);
  -moz-box-shadow: 1px -4px 18px -3px rgba(56, 56, 56, 0.75);

  width: 100%;
  padding: 1rem 1.5rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;
const PublicToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  font-size: 1.3rem;
  font-weight: bold;
`;
const SubmitButton = styled.button`
  background-color: ${colors.green400};

  font-size: 1.3rem;
  font-weight: bold;

  border-radius: 5px;
  text-align: center;

  padding: 10px 15px;

  color: ${colors.white};

  cursor: pointer;

  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${colors.green200};
  }
`;

const titlePlaceholder = '제목을 입력해주세요';
const tagPlaceholder = '태그를 입력해주세요';
export default function Write() {
  const router = useRouter();
  const { accessToken } = useUser();
  const { openSnackBar } = useSnackBar();
  const { task, isLoading, refetch } = useGetTask();

  const [title, setTitle] = useState(task?.title || '');
  const [tag, setTag] = useState('');
  const [tagList, setTagList] = useState<string[]>([]);
  const [markdown, setMarkdown] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const [isModify, setIsModify] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!task) return;
    if (!router.query.task_id) return;
    setTitle(task.title as string);
    setTagList(task.tags as string[]);
    setMarkdown(task.description as string);
    setIsPublic(task.is_public as boolean);

    setIsModify(true);
  }, [isLoading, task]);

  const onTagSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code !== 'Enter') return;
    if (tag === '') return;
    e.preventDefault();

    setTag('');
    if (tagList.includes(tag)) return;
    setTagList((prev) => [...prev, tag]);
  };

  const onTagFocus = (e: FocusEvent<HTMLInputElement>) => {
    openSnackBar(
      `엔터를 입력하여 태그를 등록할 수 있습니다.
      등록된 태그를 클릭하면 삭제됩니다.`,
    );
  };

  const onTagDelete = (e: MouseEvent<HTMLSpanElement>) => {
    const targetIndex = tagList.findIndex(
      (tag) => tag === e.currentTarget.innerHTML,
    );

    const updatedList = tagList
      .slice(0, targetIndex)
      .concat(tagList.slice(targetIndex + 1));

    setTagList(updatedList);
  };

  const onSubmit = async () => {
    if (!accessToken) return;
    if (!router.query?.id) return;
    if (!title) return openSnackBar('제목을 입력해주세요.');
    if (!tagList.length) return openSnackBar('태그를 입력해주세요.');
    if (!markdown) return openSnackBar('내용을 입력해주세요.');

    if (isModify) {
      if (!task?.id) return null;
      const res = await client.modifyTask({
        token: accessToken,
        body: {
          title,
          tags: JSON.stringify(tagList),
          description: markdown,
          description_resource_links: JSON.stringify(
            extractImageLinks(markdown),
          ),
          is_public: isPublic,
        },
        task_id: task?.id + '',
      });
      if (res?.ok) {
        refetch();
        router.replace(`/tasks/${task?.id}`);
      } else openSnackBar('요청에 실패하였습니다.');
    } else {
      const res = await client.createTask({
        token: accessToken,
        body: {
          title,
          tags: JSON.stringify(tagList),
          description: markdown,
          description_resource_links: JSON.stringify(
            extractImageLinks(markdown),
          ),
          is_public: isPublic,
        },
        task_group_id: router.query?.id as string,
      });
      if (res?.ok) {
        router.replace(`/tasks/${res?.id}`);
      } else openSnackBar('요청에 실패하였습니다.');
    }
  };

  return (
    <Container>
      <EditorSection>
        <TitleInputWrapper>
          <TitleInput
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={titlePlaceholder}
          />
          <TitleDiv />
        </TitleInputWrapper>
        <TagInputWrapper>
          {tagList.map((tag, idx) => (
            <Tag key={`${tag}_${idx}`} onClick={onTagDelete}>
              {tag}
            </Tag>
          ))}
          <TagInput
            type="text"
            placeholder={tagPlaceholder}
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onFocus={onTagFocus}
            onKeyUp={onTagSubmit}
          />
        </TagInputWrapper>
        <EditorWrapper data-color-mode="light">
          <Editor
            markdown={markdown}
            setMarkdown={setMarkdown}
            height="100%"
            minHeight={300}
            visibleDragbar={false}
            hiddenPreviewButton
          />
        </EditorWrapper>
      </EditorSection>
      <PreviewSection>
        <Title>{title || titlePlaceholder}</Title>
        <PreviewWrapper data-color-mode="light">
          <MDEditor.Markdown
            source={markdown}
            css={css`
              background-color: ${colors.grey100};
            `}
          />
        </PreviewWrapper>
      </PreviewSection>
      <SubmitBar>
        <PublicToggle>
          공개
          <Switch
            checked={isPublic}
            onChange={(checked) => setIsPublic(checked)}
            checkedIcon={false}
            uncheckedIcon={false}
          />
        </PublicToggle>
        <SubmitButton type="button" onClick={onSubmit}>
          작성
        </SubmitButton>
      </SubmitBar>
    </Container>
  );
}
