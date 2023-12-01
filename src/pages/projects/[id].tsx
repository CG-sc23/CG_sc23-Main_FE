import styled from '@emotion/styled';
import { bpmax, bpmin } from '@/libs/styles/constants';
import { css } from '@emotion/react';
import Card from '@/components/Card';
import MDEditor from '@uiw/react-md-editor';

import { myProjectStatus } from '@/libs/utils/project';
import { colors } from '@/components/constant/color';
import { Milestone } from '@/components/Projects/Milestone';
import useGetProject from '@/hooks/project/useGetProject';

import { milestoneCreationPermitted } from '@/libs/utils/milestone';
import { Dispatch, MouseEvent, SetStateAction, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import client from '@/api/client';
import {
  MakeInviteResponse,
  ProjectStatus,
  SearchResponse,
  ViewJoinRequestResponse,
} from '@/libs/type/client';
import { safeLocalStorage } from '@toss/storage';
import { queryKey } from '@/libs/constant';
import { GetProjectInviteForInviterApiResponse } from '@/libs/type/server';
import useSnackBar from '@/hooks/useSnackBar';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate } from '@/libs/utils';
import Image from 'next/image';
import Link from 'next/link';
import useUser from '@/hooks/user/useUser';
import CustomSuspense from '@/components/CustomSuspense';
import ConditionalRendering from '@/components/ConditionalRendering';

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
const SubHeader = styled.h1`
  width: 100%;
  font-size: 1.5rem;
  font-weight: 600;
`;

const Div = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.grey400};
`;

const MemberList = styled.div`
  position: relative;
  width: 100%;

  & + & {
    margin-top: 1rem;
  }
`;

const ThumbnailGroup = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 10px;
`;

const MemberThumbnailWrapper = styled(Link)`
  position: relative;

  width: 3rem;
  height: 3rem;

  border-radius: 9999px;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid ${colors.grey400};

  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.7;
  }
`;

const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
const Button = styled.button<{ hoverColor?: string; disabledColor?: string }>`
  background-color: ${(props) => props.color || colors.blue600};

  font-size: 1.5rem;
  font-weight: bold;

  border-radius: 5px;
  text-align: center;

  padding: 10px 5px;

  color: ${colors.white};

  cursor: pointer;

  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${(props) => props.hoverColor || colors.blue400};
  }
  &:disabled {
    background-color: ${(props) => props.disabledColor || colors.blue200};
    cursor: not-allowed;
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

const Reply = styled.button`
  outline: none;
  border: none;
  background: none;

  height: 100%;

  border-radius: 5px;
  padding: 1rem 1.5rem;
  font-size: 1.5rem;

  background-color: ${(props) =>
    props.color === 'green' ? colors.green300 : colors.red300};
  color: ${colors.white};

  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${(props) =>
      props.color === 'green' ? colors.green200 : colors.red200};
  }
  &:disabled {
    background-color: ${(props) =>
      props.color === 'green' ? colors.green100 : colors.red100};
    cursor: not-allowed;
  }
`;

enum OrdinalNumber {
  FIRST,
  SECOND,
  THIRD,
  FORTH,
}

export default function ProjectDetail() {
  const { project, isLoading, refetch } = useGetProject();
  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
  const { isLoggedIn, user } = useUser();
  const { openSnackBar } = useSnackBar();

  // TODO Toggle Menu
  const [toggleAdminMenu, setToggleAdminMenu] = useState('0000');
  const [toggleUserMenu, setToggleUserMenu] = useState('000');

  const getToggleState = (toggle: string) => (idx: number) =>
    toggle.at(idx) === '1';
  const updateToggle = (toggle: string) => (idx: number) => {
    if (toggle.at(idx) === '1') {
      return toggle.slice(0, idx) + '0' + toggle.slice(idx + 1);
    } else {
      const updated = '0'.repeat(toggle.length);

      return updated.slice(0, idx) + '1' + updated.slice(idx + 1);
    }
  };
  const toggleUpdateHandler =
    (toggle: string, setter: Dispatch<SetStateAction<string>>) =>
    (idx: number) =>
    () =>
      setter(updateToggle(toggle)(idx));

  // TODO User_Button 1. Join Project
  const [joinProjectLoading, setJoinProjectLoading] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');

  const canParticipate = useMemo(() => {
    if (!user?.id) return false;

    const isMember =
      project?.members?.findIndex((m) => m.id === user?.id) !== -1;
    if (isMember) return false;

    return true;
  }, [user?.id, project?.members]);

  // TODO Admin_Button 1. Invite User
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

  // TODO Admin_Button 2. Check invited User
  const [projectInvitee, setProjectInvitee] = useState<
    GetProjectInviteForInviterApiResponse['result']
  >([]);
  const [projectInviteeLoading, setProjectInviteeLoading] = useState(false);

  // TODO Admin_Button 3. Change project's status
  const [projectStatusLoading, setProjectStatusLoading] = useState(false);

  // TODO Admin_Button 4. View join request
  const [joinRequest, setJoinRequest] = useState<
    ViewJoinRequestResponse['result']
  >([]);
  const [joinRequestLoading, setJoinRequestLoading] = useState(false);

  // TODO Admin_Button 5. Reply join request
  const [replyJoinRequestLoading, setReplyJoinRequestLoading] = useState(false);
  const onReply = async (accept: boolean, join_request_id: number) => {
    if (replyJoinRequestLoading) return;
    if (!token) return;
    if (!user?.id) return;
    setReplyJoinRequestLoading(true);

    const res = await client
      .replyJoinRequest({
        token: token,
        body: {
          accept,
          join_request_id,
        },
      })
      .finally(() => setReplyJoinRequestLoading(false));

    if (res?.ok) {
      setJoinRequest((prev) => prev?.filter((j) => +j.id !== join_request_id));
      openSnackBar('요청에 성공하였습니다.');
      refetch();
    } else openSnackBar('요청에 실패하였습니다.');
  };

  // TODO Admin_Button 5. Reply join request
  const [kickMemberLoading, setKickMemberLoading] = useState(false);
  const onKick = async (email: string) => {
    if (kickMemberLoading) return;
    if (!token) return;
    if (!project?.id) return;
    setKickMemberLoading(true);

    const res = await client
      .kickMember({
        token: token,
        project_id: project?.id,
        user_email: email,
      })
      .finally(() => setKickMemberLoading(false));

    if (res?.ok) {
      openSnackBar('요청에 성공하였습니다.');
      refetch();
    } else openSnackBar('요청에 실패하였습니다.');
  };

  // TODO Milestone 1. Register new milestone
  const [newMilestone, setNewMilestone] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');
  const [createMileStoneLoading, setCreateMileStoneLoading] = useState(false);

  const handleTagDelete = (e: MouseEvent<HTMLElement>) => {
    const targetIndex = tags.findIndex(
      (tag) => tag === e.currentTarget.innerHTML,
    );

    const updatedList = tags
      .slice(0, targetIndex)
      .concat(tags.slice(targetIndex + 1));

    setTags(updatedList);
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
      <CustomSuspense isLoading={isLoading}>
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

        <Card>
          <Block
            css={css`
              gap: 1rem;
            `}
          >
            <Header>참여 멤버</Header>
            <ThumbnailGroup>
              {project?.members?.map((m) => (
                <MemberThumbnailWrapper
                  key={`USER_PROFILE_${m.id}`}
                  href={`/user/${m?.id}`}
                >
                  <Image
                    src={
                      m?.profile_image_link && m?.profile_image_updated_at
                        ? `${m?.profile_image_link}?timestamp=${m?.profile_image_updated_at}`
                        : '/profile.jpg'
                    }
                    alt={m.name}
                    fill
                    sizes="(max-width: 768px) 100px, (max-width: 1200px) 50vw, 33vw"
                  />
                </MemberThumbnailWrapper>
              ))}
            </ThumbnailGroup>
          </Block>
        </Card>

        <Card style={{ position: 'relative' }}>
          <Header>사용자 메뉴</Header>
          <ButtonBox>
            <Button
              color={colors.green600}
              hoverColor={colors.green400}
              disabledColor={colors.green200}
              onClick={toggleUpdateHandler(
                toggleUserMenu,
                setToggleUserMenu,
              )(OrdinalNumber.FIRST)}
              disabled={!canParticipate}
            >
              프로젝트 참여 요청
            </Button>
            <Button
              color={colors.green600}
              hoverColor={colors.green400}
              disabledColor={colors.green200}
              onClick={toggleUpdateHandler(
                toggleUserMenu,
                setToggleUserMenu,
              )(OrdinalNumber.SECOND)}
            >
              빠밤
            </Button>
            <Button
              color={colors.green600}
              hoverColor={colors.green400}
              disabledColor={colors.green200}
              onClick={toggleUpdateHandler(
                toggleUserMenu,
                setToggleUserMenu,
              )(OrdinalNumber.THIRD)}
            >
              프로젝트 기여도
            </Button>
          </ButtonBox>
          <ConditionalRendering
            condition={toggleUserMenu.includes('1')}
            isAnimate
          >
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
              <ConditionalRendering
                condition={getToggleState(toggleUserMenu)(OrdinalNumber.FIRST)}
              >
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
                      if (!token) return;
                      if (!project?.id) return;
                      if (joinProjectLoading) return;
                      setJoinProjectLoading(true);

                      const res = await client
                        .makeJoinRequest({
                          token,
                          project_id: project.id,
                          body: {
                            message: joinMessage,
                          },
                        })
                        .finally(() => setJoinProjectLoading(false));

                      if (res?.ok) openSnackBar('요청이 완료되었습니다.');
                      else openSnackBar('요청이 실패하였습니다.');

                      setJoinMessage('');
                    }}
                  >
                    <input
                      type="text"
                      value={joinMessage}
                      onChange={(e) => setJoinMessage(e.target.value)}
                      placeholder="요청 메시지를 입력해주세요."
                      css={css`
                        box-sizing: border-box;
                        border: none;
                        outline: none;
                        background: none;

                        border: 3px solid ${colors.green200};
                        border-radius: 5px;

                        padding: 5px 10px;

                        font-size: 1.5rem;
                        flex: 1;
                      `}
                    />
                    <button
                      css={css`
                        box-sizing: border-box;
                        background-color: ${colors.green400};
                        border-radius: 5px;
                        font-weight: bold;
                        font-size: 1.5rem;
                        padding: 5px 20px;

                        color: ${colors.white};

                        cursor: pointer;

                        transition: background-color 0.2s ease;
                        &:hover {
                          background-color: ${colors.green200};
                        }
                      `}
                      type="submit"
                    >
                      요청
                    </button>
                  </form>
                </motion.div>
              </ConditionalRendering>
              <ConditionalRendering
                condition={getToggleState(toggleUserMenu)(OrdinalNumber.SECOND)}
              >
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
                  4
                </motion.div>
              </ConditionalRendering>
              <ConditionalRendering
                condition={getToggleState(toggleUserMenu)(OrdinalNumber.THIRD)}
              >
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
                  5
                </motion.div>
              </ConditionalRendering>
            </motion.div>
          </ConditionalRendering>
        </Card>

        <ConditionalRendering
          condition={milestoneCreationPermitted(project?.permission)}
        >
          <Card style={{ position: 'relative' }}>
            <Header>관리자 메뉴</Header>
            <ButtonBox>
              <Button
                onClick={toggleUpdateHandler(
                  toggleAdminMenu,
                  setToggleAdminMenu,
                )(OrdinalNumber.FIRST)}
              >
                멤버 초대
              </Button>
              <Button
                onClick={async () => {
                  if (projectInviteeLoading) return;
                  if (!token) return;
                  if (!project?.id) return;
                  setProjectInviteeLoading(true);

                  toggleUpdateHandler(
                    toggleAdminMenu,
                    setToggleAdminMenu,
                  )(OrdinalNumber.SECOND)();
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
              <Button
                onClick={toggleUpdateHandler(
                  toggleAdminMenu,
                  setToggleAdminMenu,
                )(OrdinalNumber.THIRD)}
              >
                프로젝트 상태 변경
              </Button>
              <Button
                onClick={async () => {
                  if (joinRequestLoading) return;
                  if (!token) return;
                  if (!project?.id) return;
                  setJoinRequestLoading(true);

                  toggleUpdateHandler(
                    toggleAdminMenu,
                    setToggleAdminMenu,
                  )(OrdinalNumber.FORTH)();
                  const res = await client
                    .viewJoinRequest({
                      token,
                      project_id: project?.id,
                    })
                    .finally(() => setJoinRequestLoading(false));

                  if (!res?.ok) return;

                  setJoinRequest(res.result);
                }}
              >
                멤버 관리
              </Button>
            </ButtonBox>

            <ConditionalRendering
              condition={toggleAdminMenu.includes('1')}
              isAnimate
            >
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
                <ConditionalRendering
                  condition={getToggleState(toggleAdminMenu)(
                    OrdinalNumber.FIRST,
                  )}
                >
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
                            request_data: search,
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
                      <ConditionalRendering condition={!!searchResult}>
                        {searchResult?.map((res, idx) => (
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
                                (i) => i.email === searchResult.at(idx)?.email,
                              );
                              if (disable) return;
                              setSearchResult(
                                (prev) =>
                                  prev && [
                                    ...prev.slice(0, idx),
                                    ...prev.slice(idx + 1),
                                  ],
                              );
                              setInviteList((prev) => prev && [...prev, res]);
                            }}
                          >
                            {res?.email}
                          </div>
                        ))}
                      </ConditionalRendering>
                      <CustomSuspense isLoading={searchLoading} />
                    </div>
                    <div
                      css={css`
                        display: flex;
                        flex-direction: column;
                        gap: 5px;
                      `}
                    >
                      <ConditionalRendering condition={!!inviteList}>
                        {inviteList?.map((res, idx) => (
                          <div
                            key={`INVITE_${res?.id}`}
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
                          >
                            {res?.email}
                          </div>
                        ))}
                      </ConditionalRendering>
                      <CustomSuspense isLoading={inviteLoading} />
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
                            {res?.success ? null : <div>{res.reason}</div>}
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
                </ConditionalRendering>
                <ConditionalRendering
                  condition={getToggleState(toggleAdminMenu)(
                    OrdinalNumber.SECOND,
                  )}
                >
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
                    <CustomSuspense isLoading={projectInviteeLoading}>
                      <ConditionalRendering
                        condition={projectInvitee?.length !== 0}
                        fallback={() => (
                          <div
                            css={css`
                              font-size: 2rem;
                              font-weight: bold;
                            `}
                          >
                            초대 멤버가 없습니다.
                          </div>
                        )}
                      >
                        {projectInvitee?.map((i) => (
                          <div
                            key={`INVITEE_${i.invitee_email}_${i.project_id}`}
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
                        ))}
                      </ConditionalRendering>
                    </CustomSuspense>
                  </motion.div>
                </ConditionalRendering>
                <ConditionalRendering
                  condition={getToggleState(toggleAdminMenu)(
                    OrdinalNumber.THIRD,
                  )}
                >
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
                </ConditionalRendering>
                <ConditionalRendering
                  condition={getToggleState(toggleAdminMenu)(
                    OrdinalNumber.FORTH,
                  )}
                >
                  <motion.div
                    key="member_admin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    css={css`
                      display: flex;
                      gap: 5px;

                      width: 100%;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                    `}
                  >
                    <MemberList key={`JOIN_REQUEST_MEMBER_${project?.id}`}>
                      <SubHeader>참가 요청</SubHeader>
                      <Div
                        css={css`
                          margin: 0.5rem 0;
                        `}
                      />
                      <CustomSuspense isLoading={joinRequestLoading}>
                        <ConditionalRendering
                          condition={joinRequest?.length !== 0}
                          fallback={() => (
                            <div
                              css={css`
                                font-size: 2rem;
                                font-weight: bold;
                              `}
                            >
                              참가 요청 멤버가 없습니다.
                            </div>
                          )}
                        >
                          {joinRequest?.map((j) => (
                            <div
                              key={`REQUEST_${j.id}_${j.user.email}`}
                              css={css`
                                box-sizing: border-box;
                                border: 2px solid ${colors.grey400};
                                border-radius: 5px;

                                width: 100%;

                                padding: 5px 10px;

                                font-size: 1.5rem;
                                transition: background-color 0.2s ease;
                                margin-top: 5px;

                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                &:first-of-type {
                                  margin-top: 0 !important;
                                }
                              `}
                            >
                              <div
                                css={css`
                                  display: flex;
                                  gap: 10px;
                                `}
                              >
                                <Link
                                  href={`/user/${j.user.id}`}
                                  css={css`
                                    color: ${colors.black};

                                    transition: color 0.2s ease;
                                    &:hover {
                                      color: ${colors.grey400};
                                    }
                                  `}
                                >
                                  {j.user.email}
                                </Link>
                                <span
                                  css={css`
                                    color: ${colors.blue400};
                                  `}
                                >
                                  요청 메시지: {j?.message}
                                </span>
                              </div>
                              <div
                                css={css`
                                  display: flex;
                                  gap: 10px;
                                `}
                              >
                                <Reply
                                  onClick={() => onReply(true, +j.id)}
                                  color="green"
                                  type="button"
                                >
                                  수락
                                </Reply>
                                <Reply
                                  onClick={() => onReply(false, +j.id)}
                                  color="red"
                                  type="button"
                                >
                                  거절
                                </Reply>
                              </div>
                            </div>
                          ))}
                        </ConditionalRendering>
                      </CustomSuspense>
                    </MemberList>
                    <MemberList key={`TEAM_MEMBER_${project?.id}`}>
                      <SubHeader>팀 멤버</SubHeader>
                      <Div
                        css={css`
                          margin: 0.5rem 0;
                        `}
                      />
                      <ConditionalRendering
                        condition={project?.members?.length !== 0}
                        fallback={() => (
                          <div
                            css={css`
                              font-size: 2rem;
                              font-weight: bold;
                            `}
                          >
                            팀 멤버가 없습니다.
                          </div>
                        )}
                      >
                        {project?.members?.map((m) => (
                          <div
                            key={`PROJECT_MEMBER_${m.email}_${m.id}_${project?.id}`}
                            css={css`
                              box-sizing: border-box;
                              border: 2px solid ${colors.grey400};
                              border-radius: 5px;

                              width: 100%;

                              padding: 5px 10px;

                              font-size: 1.5rem;
                              transition: background-color 0.2s ease;
                              margin-top: 5px;

                              display: flex;
                              justify-content: space-between;
                              align-items: center;
                              &:first-of-type {
                                margin-top: 0 !important;
                              }
                            `}
                          >
                            <Link
                              href={`/user/${m.id}`}
                              css={css`
                                color: ${colors.black};

                                transition: color 0.2s ease;
                                &:hover {
                                  color: ${colors.grey400};
                                }
                              `}
                            >
                              {m.email}
                            </Link>
                            <div
                              css={css`
                                display: flex;
                                gap: 10px;
                              `}
                            >
                              <Reply
                                onClick={() => onKick(m.email)}
                                color="red"
                                type="button"
                                disabled={project?.owner?.id === m.id}
                              >
                                추방
                              </Reply>
                            </div>
                          </div>
                        ))}
                      </ConditionalRendering>
                    </MemberList>
                  </motion.div>
                </ConditionalRendering>
              </motion.div>
            </ConditionalRendering>
          </Card>
        </ConditionalRendering>

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
            <Header>프로젝트 일정</Header>
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
              <span>{project?.due_date && formatDate(project?.due_date)}</span>
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

        <Card
          css={css`
            ${bpmax[0]} {
              padding-top: 2rem;
              border-top: 0.3rem solid ${colors.grey300};
            }
          `}
        >
          <Header>프로젝트 설명</Header>
          <Block data-color-mode="light">
            <MDEditor.Markdown
              source={project?.description}
              css={css`
                width: 100%;
              `}
            />
          </Block>
        </Card>

        <ConditionalRendering
          condition={milestoneCreationPermitted(project?.permission)}
        >
          <Card
            css={css`
              ${bpmax[0]} {
                padding-top: 2rem;
                border-top: 0.3rem solid ${colors.grey300};
              }
            `}
          >
            <Header>마일스톤 생성</Header>
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
                    key={`TAGS_${tag}`}
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
        </ConditionalRendering>

        <Card
          css={css`
            ${bpmax[0]} {
              padding: 2rem;
              border-top: 0.3rem solid ${colors.grey300};
            }
          `}
        >
          <Block>
            <Header
              css={css`
                padding-bottom: 1rem;
              `}
            >
              마일스톤 목록 ({project?.milestone?.length})
            </Header>
            {project?.milestone?.map((milestone) => (
              <Milestone
                key={`MILESTONE_${milestone.id}_${project.id}`}
                id={milestone.id}
                subject={milestone.subject}
                tags={(milestone.tags as string[]) || []}
              />
            ))}
          </Block>
        </Card>
      </CustomSuspense>
    </Container>
  );
}
