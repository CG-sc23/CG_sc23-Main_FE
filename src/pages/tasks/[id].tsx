import { colors } from '@/components/constant/color';
import { bpmax } from '@/libs/styles/constants';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import MDEditor from '@uiw/react-md-editor';
import useGetTask from '@/hooks/task/useGetTask';
import LoadingSpinner from '@/components/Spinner';
import Image from 'next/image';
import { formatDate } from '@/libs/utils';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import useUser from '@/hooks/user/useUser';
import useSnackBar from '@/hooks/useSnackBar';
import client from '@/api/client';
import ConditionalRendering from '@/components/ConditionalRendering';

const MEMBER_LIMIT = 5;
const OVERLAP_NUMBER = 25;

const Container = styled.div`
  position: relative;
  width: 896px;

  background-color: ${colors.white};
`;

const Article = styled.section`
  box-sizing: border-box;
  position: relative;

  display: flex;
  flex-direction: column;

  min-height: 100vh;
  height: 100%;

  margin: 0 auto;

  ${bpmax[3]} {
    width: 100%;
  }
`;
const Header = styled.div`
  box-sizing: border-box;
  width: 100%;

  padding: 2rem;

  border-bottom: 2px solid ${colors.grey300};

  ${bpmax[3]} {
    padding: 1rem;
  }
`;
const Title = styled.h1`
  font-size: 3.5rem;
  padding: 1rem 0;

  border-bottom: 1px solid ${colors.grey300};
`;
const Info = styled.div`
  width: 100%;
  display: flex;

  padding: 0.5rem 0;

  justify-content: space-between;
  align-items: center;
`;
const Author = styled(Link)`
  display: flex;
  align-items: center;

  gap: 5px;

  font-size: 1.2rem;
  font-weight: 600;
`;
const AuthorThumbnailWrapper = styled.div`
  position: relative;

  width: 2rem;
  height: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 9999px;
  overflow: hidden;
`;
const Date = styled.div`
  font-size: 1.2rem;
`;
const TagList = styled.div`
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

const Content = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;

  ${bpmax[3]} {
    padding: 1rem;
  }
`;
const MarkdownWrapper = styled.div`
  position: relative;
  flex: 1;

  background-color: transparent;

  padding: 1rem 0.5rem;
`;
const Markdown = css({
  height: '100%',
  backgroundColor: 'transparent',
});
const Detail = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 2rem 0.5rem;

  border-top: 2px solid ${colors.grey300};
`;
const DetailLeft = styled.div`
  position: relative;
  height: 100%;

  flex: 1;
  display: flex;
  align-items: center;

  gap: 1rem;
`;
const ProjectThumbnailWrapper = styled.div`
  position: relative;

  width: 8rem;
  height: 8rem;

  border-radius: 9999px;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;

  ${bpmax[3]} {
    width: 7rem;
    height: 7rem;
  }
`;
const TaskParents = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: 1rem;

  font-weight: bold;
`;
const ProjectTitle = styled(Link)`
  font-size: 2.5rem;

  ${bpmax[3]} {
    font-size: 2rem;
  }

  transition: color 0.2s ease;
  &:hover {
    color: ${colors.grey400};
  }
`;
const MilestoneTitle = styled(Link)`
  font-size: 2rem;

  ${bpmax[3]} {
    font-size: 1.5rem;
  }
  transition: color 0.2s ease;
  &:hover {
    color: ${colors.grey400};
  }
`;
const TaskGroupTitle = styled(Link)`
  font-size: 1.5rem;

  ${bpmax[3]} {
    font-size: 1rem;
  }
  transition: color 0.2s ease;
  &:hover {
    color: ${colors.grey400};
  }
`;
const DetailRight = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: flex-end;

  height: 100%;
`;
const DDay = styled.div`
  font-size: 2rem;
  font-weight: bold;
  text-align: right;

  &.plus {
    color: ${colors.blue400};
  }

  ${bpmax[3]} {
    font-size: 1.5rem;
  }
`;
const ThumbnailGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const MemberThumbnailWrapper = styled(Link)<{ index: number; length: number }>`
  position: relative;

  width: 3rem;
  height: 3rem;

  display: flex;
  display: ${(props) => (props.index < MEMBER_LIMIT + 1 ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;

  border-radius: 9999px;
  overflow: hidden;

  right: ${(props) => {
    const LIMIT = Math.min(props.length, MEMBER_LIMIT);
    const isMore = props.index === MEMBER_LIMIT;
    const isLast = props.length - 1 === props.index;

    return isMore || isLast
      ? '0px'
      : `${-OVERLAP_NUMBER * (LIMIT - props.index) + OVERLAP_NUMBER}px`;
  }};
  z-index: ${(props) => `${props.length - props.index}`};

  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.7;
  }
`;
const More = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: bold;

  border-radius: 9999px;
  background-color: ${colors.white};
  border: 1px solid ${colors.grey300};
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ReportButton = styled.button`
  font-size: 1.2rem;
  background-color: ${colors.red100};

  border-radius: 5px;

  padding: 0.5rem;
  margin-left: 5px;

  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    background-color: ${colors.red300};
  }
  &:disabled {
    cursor: not-allowed;
    background-color: ${colors.red50};
  }
`;
const FloatButton = styled(Link)`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 4rem;
  bottom: 4rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 4rem;
  z-index: 9999;
  font-size: 1.5rem;
  font-weight: 500;
  background-color: ${colors.black};
  color: white;
  box-shadow: 5px 5px 10px ${colors.grey500};

  ${bpmax[0]} {
    right: 2rem;
    bottom: 2rem;
  }
  cursor: pointer;

  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.grey800};
  }
`;

export default function TaskPage() {
  const { user, accessToken } = useUser();
  const { task, isLoading } = useGetTask();
  const { openSnackBar } = useSnackBar();
  const [reportLoading, setReportLoading] = useState(false);
  const ownerProfile = useMemo(
    () => task?.members?.find((m) => m.id === task?.owner?.id),
    [task],
  );
  const isOwner = Boolean(user && user.id === ownerProfile?.id);

  const onReport = async () => {
    if (!accessToken) return;
    if (reportLoading) return;
    if (!task?.id) return;
    setReportLoading(true);

    const res = await client
      .createReport({
        token: accessToken,
        body: {
          title: `Report to ${task?.owner?.name} from ${user?.name}`,
          description: `Report to task ${task?.id}`,
        },
        task_id: task?.id,
      })
      .finally(() => setReportLoading(false));

    if (res?.ok) return openSnackBar('신고가 접수되었습니다.');
    openSnackBar('요청에 실패하였습니다.');
  };

  return (
    <Container>
      {isLoading ? (
        <LoadingWrapper>
          <LoadingSpinner />
        </LoadingWrapper>
      ) : (
        <Article>
          <Header>
            <Title>{task?.title}</Title>
            <Info>
              <Author href={`/user/${ownerProfile?.id}`}>
                <AuthorThumbnailWrapper>
                  <Image
                    src={
                      ownerProfile?.profile_image_link &&
                      ownerProfile?.profile_image_updated_at
                        ? `${ownerProfile?.profile_image_link}?timestamp=${ownerProfile?.profile_image_updated_at}`
                        : '/profile.jpg'
                    }
                    alt={ownerProfile?.email as string}
                    fill
                  />
                </AuthorThumbnailWrapper>
                {task?.owner?.name}
              </Author>
              <Date>{formatDate(task?.created_at as string)}</Date>
            </Info>
            <TagList>
              {Array.isArray(task?.tags) &&
                task?.tags?.map((val) => <Tag key={val}>{val}</Tag>)}
            </TagList>
          </Header>
          <Content>
            <MarkdownWrapper data-color-mode="light">
              <MDEditor.Markdown
                source={task?.description}
                css={Markdown}
                style={{ backgroundColor: 'transparent' }}
              />
            </MarkdownWrapper>
          </Content>
          <Detail>
            <DetailLeft>
              <ProjectThumbnailWrapper>
                <Image
                  src={task?.project?.thumbnail_image ?? '/project.jpg'}
                  fill
                  alt="project_thumbnail"
                />
              </ProjectThumbnailWrapper>
              <TaskParents>
                <ProjectTitle href={`/projects/${task?.project?.id}`}>
                  {task?.project?.title}
                </ProjectTitle>
                <MilestoneTitle href={`/milestones/${task?.milestone?.id}`}>
                  {task?.milestone?.subject}
                </MilestoneTitle>
                <TaskGroupTitle href={`/tasksgroups/${task?.task_group?.id}`}>
                  {task?.task_group?.title}
                </TaskGroupTitle>
              </TaskParents>
            </DetailLeft>
            <DetailRight>
              <ThumbnailGroup>
                {task?.members?.map((m, idx, origin) => (
                  <MemberThumbnailWrapper
                    href={`/user/${m.id}`}
                    key={`${m.email}_${m.id}`}
                    index={idx}
                    length={origin.length}
                  >
                    {idx < MEMBER_LIMIT ? (
                      <Image
                        src={
                          m?.profile_image_link && m?.profile_image_updated_at
                            ? `${m?.profile_image_link}?timestamp=${m?.profile_image_updated_at}`
                            : '/profile.jpg'
                        }
                        alt={m.email}
                        fill
                      />
                    ) : (
                      <More>+ {origin.length - MEMBER_LIMIT}</More>
                    )}
                  </MemberThumbnailWrapper>
                ))}
                <ReportButton disabled={isOwner} onClick={onReport}>
                  🚨
                </ReportButton>
              </ThumbnailGroup>
            </DetailRight>
          </Detail>
        </Article>
      )}
      <ConditionalRendering condition={isOwner}>
        <FloatButton
          href={`/tasks/write/${task?.task_group?.id}?task_id=${task?.id}`}
        >
          ✏️
        </FloatButton>
      </ConditionalRendering>
    </Container>
  );
}
