import { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { bp, bpmax } from '@/libs/styles/constants';
import { SubmitHandler, useForm } from 'react-hook-form';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { assert } from '@/libs/utils/assert';
import client from '@/api/client';
import {
  ModifyUserDetailInfoAuthTokenAndBody,
  UserDetailInfoResponse,
} from '@/libs/type/client';
import useUser from '@/hooks/user/useUser';
import { useRouter } from 'next/router';
import { extractImageLinks } from '@/libs/utils/editor';
import Dropzone from '@/components/Dropzone';
import { DropZoneWrapper } from '@/components/Auth/StepSignUp/common';
import { uploadImg } from '@/libs/utils/s3';
import { safeLocalStorage } from '@toss/storage';
import { queryKey } from '@/libs/constant';

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const Form = styled.form`
  width: 672px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  ${bpmax[0]} {
    width: 100%;
  }
`;

const List = styled.div`
  position: relative;
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  ${bpmax[0]} {
    width: 90%;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 1rem;
  font-weight: 600;
`;

const Stressed = styled.span`
  color: red;
  font-size: 0.5rem;
`;

const Input = styled.input`
  font-size: 1rem;
  padding: 0.75rem 0.5rem;
  border: 1px solid #cdcdcd;
  border-radius: 0.5rem;
  outline: none;
  &:focus {
    border: 1px solid black;
  }
`;

const Submit = styled.button`
  width: 70%;
  padding: 1rem;
  border: none;
  background-color: #cdcdcd;
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: black;
  }
  ${bpmax[0]} {
    width: 90%;
    background-color: black;
  }
`;

type FormData = Partial<ModifyUserDetailInfoAuthTokenAndBody['body']>;

export const getServerSideProps = (async (ctx) => {
  const id = ctx.query?.id as string;
  assert(id, "Can't not find ID.");

  const user = await client.userDetail({
    user_id: id,
  });

  assert(user, 'Invalid user.');

  return {
    props: { user, id },
  };
}) satisfies GetServerSideProps<{
  user: UserDetailInfoResponse;
  id: string;
}>;

export default function Update({ user, id }: InferGetServerSidePropsType<any>) {
  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
  const { user: loggedInUser, isLoading } = useUser();
  const router = useRouter();
  const isOwn = useMemo(() => {
    return loggedInUser && loggedInUser.email === user.email;
  }, [loggedInUser, user]);
  const [markdown, setMarkdown] = useState(user?.description ?? '');
  const [profileImageLink, setProfileImageLink] = useState(
    user?.profile_image_link,
  );
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: user?.name as string,
      github_link: user?.github_link as string,
      short_description: user?.short_description as string,
    },
  });

  const onUploadProfileImage = async (file: File) => {
    if (!token) return;
    const url = await uploadImg({
      token,
      file,
      filename: file.name,
    });

    setProfileImageLink(url);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!token) return;
    const uploadData: FormData = {
      ...data,
      description: markdown,
      description_resource_links: extractImageLinks(markdown),
      profile_image_link: profileImageLink,
    };

    const res = await client.modifyUserInfo({
      token,
      body: uploadData,
    });

    if (res?.ok) router.push(`/user/${id}`);
  };

  useEffect(() => {
    if (!isLoading && !isOwn) router.replace('/');
  }, [isOwn]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <DropZoneWrapper>
        <Dropzone
          onFileAdded={onUploadProfileImage}
          defaultThumbnail={profileImageLink ?? '/profile.jpg'}
        />
      </DropZoneWrapper>
      {/* email */}
      <h1
        css={css`
          font-size: 2rem;
          font-weight: 400;
          text-decoration: none;
        `}
      >
        {user?.email}
      </h1>
      {/* name */}
      <List>
        <Label htmlFor="name">
          <Stressed>* </Stressed>닉네임
        </Label>
        <Input id="name" type="text" {...register("name")} />
      </List>
      <List>
        <Label htmlFor="github_link">
          <Stressed>* </Stressed>깃허브 주소
        </Label>
        <Input id="github_link" type="text" {...register("github_link")} />
      </List>
      <List>
        <Label htmlFor="short_description">
          <Stressed>* </Stressed>한 줄 소개
        </Label>
        <Input
          id="short_description"
          type="text"
          {...register("short_description")}
        />
      </List>
      <List>
        <Label htmlFor="description">
          <Stressed>* </Stressed>자기소개
        </Label>
        <div
          css={css`
            min-height: 300px;
          `}
        >
          <Editor markdown={markdown} setMarkdown={setMarkdown} />
        </div>
      </List>
      <Submit type="submit">수정 완료</Submit>
    </Form>
  );
}
