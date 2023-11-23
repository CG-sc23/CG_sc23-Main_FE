import styled from '@emotion/styled';
import { bpmax, bpmin } from '@/libs/styles/constants';
import { css } from '@emotion/react';
import Card from '@/components/Card';
import MDEditor from '@uiw/react-md-editor';
// const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {ssr:false});

import { myProjectStatus } from '@/libs/utils/project';
import { colors } from '@/components/constant/color';
import { Milestone } from '@/components/Projects/Milestone';
import useGetProject from '@/hooks/project/useGetProject';
import LoadingSpinner from '@/components/Spinner';
import Link from 'next/link';
import { FaRegPlusSquare } from 'react-icons/fa';
import { milestoneCreationPermitted } from '@/libs/utils/milestone';
import { MouseEvent, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import client from '@/api/client';
import {
  MakeInviteResponse,
  ProjectStatus,
  SearchResponse,
} from '@/libs/type/client';
import { safeLocalStorage } from '@toss/storage';
import { queryKey } from '@/libs/constant';
import { GetProjectInviteForInviterApiResponse } from '@/libs/type/server';
import useSnackBar from '@/hooks/useSnackBar';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate } from '@/libs/utils';
import dynamic from 'next/dynamic';

const Container = styled.div`
  height: 100%;
  width: 896px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* mobile */
  ${bpmax[0]} {
    width: 100%;
    padding: 0;
  }
`;

const Block = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.h1`
  width: 100%;
  font-size: 2rem;
  font-weight: 600;
`;

const SubHeader = styled.h2`
  width: 100%;
  font-size: 1.5rem;
  font-weight: 500;
`;

const Button = styled.button`
  background-color: ${colors.blue600};

  font-size: 1.5rem;
  font-weight: bold;

  border-radius: 5px;
  text-align: center;

  padding: 10px 5px;

  color: ${colors.white};

  cursor: pointer;

  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${colors.blue400};
  }
`;

const TagWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Tag = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 0.2rem;
  background-color: ${colors.grey300};
  color: black;
`;

export default function ProjectDetail() {
  const { project, isLoading, refetch } = useGetProject();
  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
  const { openSnackBar } = useSnackBar();
  const [toggle, setToggle] = useState('000');

  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResponse['result']>(
    [],
  );
  const [inviteList, setInviteList] = useState<SearchResponse['result']>([]);
  const [inviteResult, setInviteResult] = useState<
    MakeInviteResponse['result']
  >([]);
  const [inviteLoading, setInviteLoading] = useState(false);

  const [projectInvitee, setProjectInvitee] = useState<
    GetProjectInviteForInviterApiResponse['result']
  >([]);
  const [projectInviteeLoading, setProjectInviteeLoading] = useState(false);

  const [projectStatusLoading, setProjectStatusLoading] = useState(false);

  const [newMilestone, setNewMilestone] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');

  const handleTagDelete = (e: MouseEvent<HTMLElement>) => {
    const targetIndex = tags.findIndex(
      (tag) => tag === e.currentTarget.innerHTML,
    );

    const updatedList = tags
      .slice(0, targetIndex)
      .concat(tags.slice(targetIndex + 1));

    setTags(updatedList);
  };
  const [createMileStoneLoading, setCreateMileStoneLoading] = useState(false);

  const getToggleState = (idx: number) => {
    return toggle.at(idx) === '1';
  };
  const onToggle = (idx: number) => {
    if (toggle.at(idx) === '1') {
      setToggle((prev) => prev.slice(0, idx) + '0' + prev.slice(idx + 1));
    } else {
      setToggle((prev) => {
        const updated = '0'.repeat(prev.length);

        return updated.slice(0, idx) + '1' + updated.slice(idx + 1);
      });
    }
  };

  const onStatus = async (status: ProjectStatus) => {
    if (!token) return;
    if (projectStatusLoading) return;
    if (!project?.id) return;
    if (status === project?.status) return;

    setProjectStatusLoading(true);

    const res = await client
      .modifyProject({
        token,
        project_id: project?.id,
        body: {
          status,
        },
      })
      .finally(() => setProjectStatusLoading(false));

    if (res?.ok) refetch();
    else openSnackBar('요청이 실패하였습니다.');
  };

  return (
    <Container>
      {/* title, thumbnail_image, short_description */}
      {isLoading ? (
        <div
          css={css`
            width: 100%;
            height: 100%;

            display: flex;
            justify-content: center;
            align-items: center;
          `}
        >
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <Card>
            <Block
              css={css`
                gap: 1rem;
              `}
            >
              <Header>{project?.title}</Header>
              <img
                src={project?.thumbnail_image}
                alt={project?.title}
                css={css`
                  width: 12rem;
                  height: 12rem;
                  object-fit: contain;
                `}
              />
              <p>{project?.short_description}</p>
            </Block>
          </Card>
          {milestoneCreationPermitted(project?.permission) ? (
            <Card style={{ position: 'relative' }}>
              <h1
                css={css`
                  font-size: 2rem;
                  font-weight: bold;
                `}
              >
                관리자 메뉴
              </h1>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  gap: 5px;
                `}
              >
                <Button onClick={() => onToggle(0)}>멤버 초대</Button>
                <Button
                  onClick={async () => {
                    if (projectInviteeLoading) return;
                    if (!token) return;
                    if (!project?.id) return;
                    setProjectInviteeLoading(true);

                    onToggle(2);
                    const res = await client
                      .projectInviter({
                        token,
                      })
                      .finally(() => setProjectInviteeLoading(false));

                    if (!res?.ok) return;
                    const list = res.result?.filter(
                      (r) => r.project_id === project.id,
                    );

                    setProjectInvitee(list);
                  }}
                >
                  초대 상태
                </Button>
                <Button onClick={() => onToggle(1)}>프로젝트 상태 변경</Button>
              </div>
              <div>
                <AnimatePresence>
                  {toggle.includes('1') ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: 'auto',
                      }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      css={css`
                        box-sizing: border-box;
                        overflow: hidden;
                      `}
                    >
                      {getToggleState(0) ? (
                        <motion.div
                          key="invite"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          css={css`
                            width: 100%;
                            position: relative;
                          `}
                        >
                          <form
                            css={css`
                              position: relative;

                              display: flex;
                              align-items: center;

                              gap: 10px;
                            `}
                            onSubmit={async (e) => {
                              e.preventDefault();
                              if (searchLoading) return;
                              setSearchLoading(true);

                              const res = await client
                                .searchUser({
                                  email: search,
                                })
                                .finally(() => setSearchLoading(false));

                              if (!res?.ok || !res.result) return;
                              setSearch('');
                              setInviteResult([]);
                              setSearchResult(res.result);
                            }}
                          >
                            <input
                              type="text"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder="이메일을 검색해주세요"
                              css={css`
                                box-sizing: border-box;
                                border: none;
                                outline: none;
                                background: none;

                                border: 3px solid ${colors.blue200};
                                border-radius: 5px;

                                padding: 5px 10px;

                                font-size: 1.5rem;
                                flex: 1;
                              `}
                            />
                            <button
                              css={css`
                                box-sizing: border-box;
                                background-color: ${colors.blue400};
                                border-radius: 5px;
                                font-weight: bold;
                                font-size: 1.5rem;
                                padding: 5px 20px;

                                color: ${colors.white};

                                cursor: pointer;

                                transition: background-color 0.2s ease;
                                &:hover {
                                  background-color: ${colors.blue200};
                                }
                              `}
                              type="submit"
                            >
                              검색
                            </button>
                          </form>
                          <div
                            css={css`
                              position: relative;
                              padding: 1rem 0;
                              width: 100%;
                            `}
                          >
                            {searchResult &&
                              searchResult.map((res, idx) => (
                                <div
                                  key={`SEARCH_${res?.id}`}
                                  css={css`
                                    border: 2px solid ${colors.blue200};
                                    border-radius: 5px;

                                    padding: 5px 10px;

                                    font-size: 1.5rem;
                                    cursor: pointer;
                                    transition: background-color 0.2s ease;
                                    &:hover {
                                      background-color: ${colors.blue50};
                                    }
                                    margin-top: 5px;
                                    &:first-of-type {
                                      margin-top: 0 !important;
                                    }
                                  `}
                                  onClick={() => {
                                    const disable = inviteList?.find(
                                      (i) =>
                                        i.email === searchResult.at(idx)?.email,
                                    );
                                    if (disable) return;
                                    setSearchResult(
                                      (prev) =>
                                        prev && [
                                          ...prev.slice(0, idx),
                                          ...prev.slice(idx + 1),
                                        ],
                                    );
                                    setInviteList(
                                      (prev) => prev && [...prev, res],
                                    );
                                  }}
                                >
                                  {res?.email}
                                </div>
                              ))}
                            {searchLoading && (
                              <div
                                css={css`
                                  width: 100%;
                                  display: flex;
                                  justify-content: center;
                                `}
                              >
                                <LoadingSpinner />
                              </div>
                            )}
                          </div>
                          <div
                            css={css`
                              display: flex;
                              flex-direction: column;
                              gap: 5px;
                            `}
                          >
                            {inviteList &&
                              inviteList.map((res, idx) => (
                                <div
                                  css={css`
                                    border: 2px solid ${colors.green200};
                                    border-radius: 5px;

                                    padding: 5px 10px;

                                    font-size: 1.5rem;
                                    cursor: pointer;
                                    transition: background-color 0.2s ease;
                                    &:hover {
                                      background-color: ${colors.green50};
                                    }
                                  `}
                                  onClick={() => {
                                    setInviteList(
                                      (prev) =>
                                        prev && [
                                          ...prev?.slice(0, idx),
                                          ...prev?.slice(idx + 1),
                                        ],
                                    );
                                  }}
                                  key={`INVITE_${res?.id}`}
                                >
                                  {res?.email}
                                </div>
                              ))}
                            {inviteLoading && (
                              <div
                                css={css`
                                  width: 100%;
                                  display: flex;
                                  justify-content: center;
                                `}
                              >
                                <LoadingSpinner />
                              </div>
                            )}
                            {inviteResult &&
                              inviteResult.map((res) => (
                                <div
                                  css={css`
                                    display: flex;
                                    justify-content: space-between;

                                    border: 2px solid
                                      ${res?.success
                                        ? colors.green600
                                        : colors.red400};
                                    border-radius: 5px;

                                    color: ${res?.success
                                      ? colors.green400
                                      : colors.red400};

                                    padding: 5px 10px;

                                    font-size: 1.5rem;
                                    transition: background-color 0.2s ease;
                                  `}
                                  key={`INVITE_RESULT_${res?.invitee_email}`}
                                >
                                  {res?.invitee_email}
                                  {res?.success ? null : (
                                    <div>{res.reason}</div>
                                  )}
                                </div>
                              ))}
                            <button
                              css={css`
                                width: 100%;
                                background-color: ${colors.black};

                                color: ${colors.white};

                                font-size: 2rem;
                                font-weight: bold;

                                border-radius: 10px;
                                cursor: pointer;

                                transition: background-color 0.2s ease;

                                &:hover {
                                  background-color: ${colors.grey700};
                                }
                              `}
                              onClick={async () => {
                                if (!token) return;
                                if (inviteLoading) return;
                                if (!inviteList) return;
                                if (!project?.id) return;
                                setInviteLoading(true);

                                const list = JSON.stringify(
                                  inviteList.map((u) => u.email),
                                );

                                const res = await client
                                  .makeInvite({
                                    token,
                                    body: {
                                      invitee_emails: list,
                                      project_id: project?.id,
                                    },
                                  })
                                  .finally(() => setInviteLoading(false));

                                if (!res?.ok) return;
                                setInviteList([]);
                                setInviteResult(res.result);
                              }}
                              type="button"
                            >
                              초대
                            </button>
                          </div>
                        </motion.div>
                      ) : null}
                      {getToggleState(1) ? (
                        <motion.div
                          key="state"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          css={css`
                            display: flex;
                            gap: 5px;
                          `}
                        >
                          <Button
                            css={css`
                              padding: 0.5rem 1.5rem;
                              background-color: ${colors.green400};
                              &:hover {
                                background-color: ${colors.green200};
                              }
                            `}
                            onClick={() => onStatus('IN_PROGRESS')}
                          >
                            진행 중
                          </Button>
                          <Button
                            css={css`
                              padding: 0.5rem 1.5rem;
                              background-color: ${colors.red400};
                              &:hover {
                                background-color: ${colors.red200};
                              }
                            `}
                            onClick={() => onStatus('TERMINATED')}
                          >
                            포기
                          </Button>
                          <Button
                            css={css`
                              padding: 0.5rem 1.5rem;
                              background-color: ${colors.yellow400};
                              &:hover {
                                background-color: ${colors.yellow200};
                              }
                            `}
                            onClick={() => onStatus('COMPLETED')}
                          >
                            완료
                          </Button>
                        </motion.div>
                      ) : null}
                      {getToggleState(2) ? (
                        <motion.div
                          key="invitee"
                          css={css`
                            display: flex;
                            position: relative;

                            width: 100%;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                          `}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {projectInviteeLoading ? (
                            <LoadingSpinner />
                          ) : projectInvitee?.length ? (
                            projectInvitee?.map((i) => (
                              <div
                                css={css`
                                  box-sizing: border-box;
                                  border: 2px solid ${colors.grey400};
                                  border-radius: 5px;

                                  width: 100%;

                                  padding: 5px 10px;

                                  font-size: 1.5rem;
                                  transition: background-color 0.2s ease;
                                  margin-top: 5px;
                                  &:first-of-type {
                                    margin-top: 0 !important;
                                  }
                                `}
                              >
                                {i.invitee_email}
                              </div>
                            ))
                          ) : (
                            <div
                              css={css`
                                font-size: 2rem;
                                font-weight: bold;
                              `}
                            >
                              초대한 멤버가 없습니다.
                            </div>
                          )}
                        </motion.div>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </Card>
          ) : null}
          {/* status, created_at, due_date */}
          <Card
            css={css`
              gap: 1.5rem;
              ${bpmax[0]} {
                padding-top: 2rem;
                border-top: 0.3rem solid ${colors.grey300};
              }
            `}
          >
            <Block
              css={css`
                gap: 1rem;
              `}
            >
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                `}
              >
                <h2
                  css={css`
                    font-size: 1.2rem;
                    font-weight: 500;
                  `}
                >
                  시작일
                </h2>
                <span>
                  {project?.created_at && formatDate(project.created_at)}
                </span>
              </div>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                `}
              >
                <h2
                  css={css`
                    font-size: 1.2rem;
                    font-weight: 500;
                  `}
                >
                  종료 예정일
                </h2>
                <span>
                  {project?.due_date && formatDate(project?.due_date)}
                </span>
              </div>
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                `}
              >
                <h2
                  css={css`
                    font-size: 1.2rem;
                    font-weight: 500;
                  `}
                >
                  프로젝트 상태
                </h2>
                <span
                  css={css`
                    font-size: 1.2rem;
                    font-weight: 500;
                    color: ${project?.status &&
                    myProjectStatus(project?.status).color};
                  `}
                >
                  {project?.status && myProjectStatus(project?.status).text}
                </span>
              </div>
            </Block>
          </Card>
          {/* description */}
          <Card
            css={css`
              ${bpmax[0]} {
                padding-top: 2rem;
                border-top: 0.3rem solid ${colors.grey300};
              }
            `}
          >
            <Block data-color-mode="light">
              <MDEditor.Markdown
                source={project?.description}
                css={css`
                  width: 100%;
                `}
              />
            </Block>
          </Card>
          {/* Create Milestones */}
          {milestoneCreationPermitted(project?.permission) ? (
            <Card
              css={css`
                ${bpmax[0]} {
                  padding-top: 2rem;
                  border-top: 0.3rem solid ${colors.grey300};
                }
              `}
            >
              <SubHeader>마일스톤 생성</SubHeader>
              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                  margin-top: 1rem;
                `}
              >
                <input
                  id="title"
                  css={css`
                    width: 100%;
                    padding: 0.8rem;
                    border: 1px solid ${colors.grey200};
                    border-radius: 0.2rem;
                    font-size: 1.2rem;
                    box-sizing: border-box;
                    &:focus {
                      outline: none;
                      border: 1px solid black;
                    }
                  `}
                  placeholder="새로운 마일스톤명 입력"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                />
                <ReactDatePicker
                  dateFormat="yyyy.MM.dd"
                  shouldCloseOnSelect
                  minDate={new Date()}
                  selected={dueDate}
                  onChange={(date) => {
                    setDueDate(date ?? new Date());
                  }}
                  css={css`
                    width: 100%;
                    padding: 0.8rem;
                    box-sizing: border-box;
                    outline: none;
                    border: 1px solid ${colors.grey200};
                    font-size: 1.2rem;
                    border-radius: 0.2rem;
                    &:focus {
                      border: 1px solid black;
                    }
                  `}
                />
                <input
                  css={css`
                    width: 100%;
                    padding: 0.8rem;
                    border: 1px solid ${colors.grey200};
                    border-radius: 0.2rem;
                    font-size: 1.2rem;
                    box-sizing: border-box;
                    &:focus {
                      outline: none;
                      border: 1px solid black;
                    }
                  `}
                  placeholder="새로 태그 추가"
                  value={tag}
                  onChange={(e) => {
                    setTag(e.target.value);
                  }}
                  onKeyUp={(e) => {
                    if (e.code !== 'Enter') return;
                    if (tag === '') return;
                    e.preventDefault();
                    e.stopPropagation();

                    setTag('');
                    if (tags.includes(tag)) return;
                    setTags((prev) => [...prev, tag]);
                  }}
                />
                <TagWrapper>
                  {tags.map((tag) => (
                    <Tag
                      onClick={handleTagDelete}
                      css={css`
                        &:hover {
                          cursor: pointer;
                        }
                      `}
                    >
                      {tag}
                    </Tag>
                  ))}
                </TagWrapper>
                <button
                  type="button"
                  onClick={async () => {
                    if (createMileStoneLoading) return;
                    if (!token) return;
                    if (!project?.id) return;

                    setCreateMileStoneLoading(true);

                    const res = await client
                      .createMileStone({
                        token,
                        project_id: project?.id + '',
                        body: {
                          due_date: dueDate.toISOString(),
                          subject: newMilestone,
                          tags: JSON.stringify(tags),
                        },
                      })
                      .finally(() => setCreateMileStoneLoading(false));

                    if (res?.ok) {
                      refetch();
                    } else openSnackBar('요청에 실패하였습니다.');
                    setNewMilestone('');
                    setTag('');
                    setTags([]);
                  }}
                  css={css`
                    width: 100%;
                    font-size: 1.2rem;
                    padding: 0.6rem;
                    border-radius: 0.2rem;
                    background-color: ${colors.grey400};
                    color: white;
                    ${bpmin[0]} {
                      &:hover {
                        background-color: black;
                        cursor: pointer;
                      }
                    }
                  `}
                  disabled={createMileStoneLoading}
                >
                  {createMileStoneLoading ? '로딩 중' : '생성'}
                </button>
              </div>
            </Card>
          ) : (
            <></>
          )}
          {/* Milestones */}
          <Card
            css={css`
              ${bpmin[0]} {
                padding-bottom: 0;
              }
              ${bpmax[0]} {
                padding-top: 2rem;
                border-top: 0.3rem solid ${colors.grey300};
              }
            `}
          >
            <Block>
              <div
                css={css`
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                  padding-bottom: 1rem;
                `}
              >
                <SubHeader>
                  마일스톤 목록 ({project?.milestone?.length})
                </SubHeader>
                {milestoneCreationPermitted(project?.permission) ? (
                  <Link href="/milestones/form">
                    <FaRegPlusSquare size="24" />
                  </Link>
                ) : null}
              </div>
              {project?.milestone?.map((milestone) => (
                <Milestone
                  id={milestone.id}
                  subject={milestone.subject}
                  tags={(milestone.tags as string[]) || []}
                />
              ))}
            </Block>
          </Card>
        </>
      )}
    </Container>
  );
}
