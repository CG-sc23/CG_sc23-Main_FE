import { useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { bp } from '@/libs/styles/constants';
import { LuPencil } from 'react-icons/lu';
import Editor from '@/components/Editor';

const Form = styled.form`
  width: 672px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  ${bp[0]} {
    width: 100%;
  }
`;

const List = styled.div`
  position: relative;
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  ${bp[0]} {
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

const TextArea = styled.textarea`
  font-size: 1rem;
  padding: 0.5rem;
  border: 1px solid #cdcdcd;
  border-radius: 0.5rem;
  resize: none;
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
  ${bp[0]} {
    width: 90%;
    background-color: black;
  }
`;

export default function Update() {
  const [profile, setProfile] = useState({
    id: null,
    email: 'jun@google.com',
    name: '임준혁',
    github_link: 'hello@github.com',
    image_link: '/profile.jpg',
    short_description: '안녕하세요 올리버쌤입니다.'.repeat(5),
    grade: 1,
    like: 12,
    rating: 4.3,
  });

  return (
    <Form>
      {/* image */}
      <div
        css={css`
          position: relative;
          width: fit-content;
          height: fit-content;
        `}
      >
        <img
          src={profile.image_link}
          css={css`
            width: 256px;
            height: 256px;
            object-fit: cover;
            ${bp[0]} {
              width: 240px;
              height: 240px;
            }
          `}
        />
        <label
          htmlFor="profile_image"
          css={css`
            position: absolute;
            right: 2.5rem;
            bottom: 2.5rem;
          `}
        >
          <div
            css={css`
              padding: 0.25rem;
              border: 1.5px solid black;
              border-radius: 9999%;
              background-color: white;
            `}
          >
            <LuPencil
              css={css`
                cursor: pointer;
                width: 2rem;
                height: 2rem;
              `}
            />
          </div>
          <input
            id="profile_image"
            type="file"
            accept="image/*"
            css={css`
              display: none;
            `}
          />
        </label>
      </div>
      {/* email */}
      <h1
        css={css`
          font-size: 2rem;
          font-weight: 400;
          text-decoration: none;
        `}
      >
        {profile.email}
      </h1>
      {/* name */}
      <List>
        <Label htmlFor="name">
          <Stressed>* </Stressed>닉네임
        </Label>
        <Input id="name" type="text" value={profile.name} />
      </List>
      <List>
        <Label htmlFor="github_link">
          <Stressed>* </Stressed>깃허브 주소
        </Label>
        <Input id="github_link" type="text" value={profile.github_link} />
      </List>
      <List>
        <Label htmlFor="short_description">
          <Stressed>* </Stressed>자기소개
        </Label>
        <TextArea
          id="short_description"
          rows={6}
          value={profile.short_description}
          maxLength={50}
        />
        <span
          css={css`
            position: absolute;
            right: 0.5rem;
            bottom: 0.5rem;
          `}
        >
            {profile.short_description.length} / 50
          </span>
        </List>
        <List>
          <Editor />
        </List>
        <Submit type="submit">수정 완료</Submit>
      </Form>
  );
}
