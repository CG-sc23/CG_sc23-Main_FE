import Link from 'next/link';
import Image from 'next/image';
import { css } from '@emotion/react';

import { bpmax } from '@/libs/styles/constants';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import MDEditor from '@uiw/react-md-editor';

import Keyword from '@/components/Keyword';
import Stack from '@/components/Stack';
import client from '@/api/client';
import { UserDetailInfoResponse } from '@/libs/type/client';
import { assert } from '@/libs/utils/assert';
import { colors } from '@/components/constant/color';
import useUser from '@/hooks/user/useUser';
import { useMemo } from 'react';

export const getServerSideProps = (async (ctx) => {
  const id = ctx.params?.id as string;
  assert(id, "Can't not find ID.");

  const user = await client.userDetail({
    user_id: id,
  });
  assert(user, 'Invalid user.');

  return {
    props: { user, id },
  };
}) satisfies GetServerSideProps<{
  id: string;
  user: UserDetailInfoResponse;
}>;

export default function Profile({
  id,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user: loggedInUser } = useUser();
  const isOwn = useMemo(() => {
    return loggedInUser && loggedInUser.email === user.email;
  }, [loggedInUser, user]);

  return (
    <div
      css={css`
        background-color: ${colors.white};
        width: 672px;
        margin: 0 auto;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 24px;
        ${bpmax[1]} {
          width: 100%;
          box-sizing: border-box;
        }
      `}
    >
      <div
        css={css`
          display: flex;
          position: relative;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <div
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;

            gap: 10px;
          `}
        >
          <Image
            width={164}
            height={164}
            src={user?.profile_image_link ?? '/profile.jpg'}
            alt="profile"
            priority
            css={css`
              border-radius: 9999px;
              width: 164px;
              height: 164px;
              object-fit: cover;
              ${bpmax[1]} {
                width: 96px;
                height: 96px;
              }
            `}
          />
          <span
            css={css`
              font-size: 1.5rem;
              font-weight: 400;
              color: ${colors.grey700};
            `}
          >
            {user?.short_description ?? '아직 한 줄 소개가 비어있어요...!'}
          </span>
        </div>
        {isOwn ? (
          <Link
            href={`/user/Update?id=${id}`}
            css={css`
              color: black;
              outline: none;
              text-decoration: none;
              border-radius: 4px;
              font-weight: 600;
              border: 1px solid #e0e0e0;
              padding: 12px 16px;
              ${bpmax[1]} {
                padding: 8px 12px;
              }
            `}
          >
            편집
          </Link>
        ) : null}
      </div>

      {/* details */}
      <div
        css={css`
          display: flex;
          width: 100%;
          align-items: flex-start;
          justify-content: space-between;
        `}
      >
        {/* name */}
        <h2
          css={css`
            font-weight: 600;
            font-size: 36px;

            ${bpmax[1]} {
              font-size: 28px;
            }
          `}
        >
          {user?.name}
        </h2>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 5px;
          `}
        >
          {/* email */}
          <div
            css={css`
              display: flex;
              align-items: center;
              gap: 1rem;
              font-size: 16px;
            `}
          >
            <img
              src="/mail.png"
              css={css`
                width: 24px;
                object-fit: cover;
              `}
            />
            <h2
              css={css`
                text-decoration: none;
              `}
            >
              {user?.email}
            </h2>
          </div>
          {/* github_link */}
          {user.github_link ? (
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: 1rem;
                font-size: 16px;
              `}
            >
              <img
                src="/github.png"
                css={css`
                  width: 24px;
                  object-fit: cover;
                `}
              />
              <h2
                css={css`
                  text-decoration: none;
                `}
              >
                {user?.github_link}
              </h2>
            </div>
          ) : null}
        </div>
      </div>
      <div
        css={css`
          width: 100%;
          height: 2px;
          background-color: #cdcdcd;
        `}
      />
      {/* description */}
      <h1
        css={css`
          font-size: 2rem;
          font-weight: bold;
        `}
      >
        자기소개
      </h1>
      <div>
        {user.description ? (
          <MDEditor.Markdown source={user.description} />
        ) : (
          <div
            css={css`
              position: relative;
              min-height: 300px;
              width: 100%;
              margin-bottom: 1.5rem;

              display: flex;

              justify-content: center;
              align-items: center;

              gap: 10px;

              background-color: ${colors.green50};
              border: 1px solid ${colors.green200};
            `}
          >
            <h2
              css={css`
                color: ${colors.black};
                text-decoration: none;
                font-size: 2rem;
                font-weight: bold;
              `}
            >
              아직 자기소개가 비어있어요!
            </h2>
          </div>
        )}
      </div>
      <h1
        css={css`
          font-size: 2rem;
          font-weight: bold;
        `}
      >
        내 기술스택
      </h1>
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <Stack hasGitHub={!!user.github_link} />
        <Keyword hasGitHub={!!user.github_link} />
      </div>
      <h1
        css={css`
          font-size: 2rem;
          font-weight: bold;
        `}
      >
        프로젝트
      </h1>
    </div>
  );
}
