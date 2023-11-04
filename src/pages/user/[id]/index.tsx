/* eslint-disable @next/next/no-img-element */
import { css } from "@emotion/react";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import ReactStars from "react-stars";

import { convertGradeToMedal } from "@/libs/utils/grade";
import { bp } from "@/libs/styles/constants";

export default function Profile() {
  const [profile, setProfile] = useState({
    id: null,
    email: "jun@google.com",
    name: "임준혁",
    github_link: "hello@github.com",
    image_link: "/profile.jpg",
    short_description: "안녕하세요 올리버쌤입니다.".repeat(5),
    grade: 1,
    like: 12,
    rating: 4.3,
  });

  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <div
        css={css`
          width: 672px;
          margin: 0 auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 24px;
          ${bp[0]} {
            width: 100%;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
          }
        `}
      >
        {/* image */}
        <div
          css={css`
            display: flex;
            position: relative;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <img
            src="/profile.jpg"
            alt="profile"
            css={css`
              border-radius: 9999px;
              width: 164px;
              height: 164px;
              object-fit: cover;
              ${bp[0]} {
                width: 96px;
                height: 96px;
              }
            `}
          />
          <Link
            href="/user/Update"
            css={css`
              color: black;
              outline: none;
              text-decoration: none;
              border-radius: 4px;
              font-weight: 600;
              border: 1px solid #e0e0e0;
              padding: 12px 16px;
              ${bp[0]} {
                padding: 8px 12px;
              }
            `}
          >
            편집
          </Link>
        </div>
        {/* details */}
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            gap: 16px;
            font-size: 12px;
          `}
        >
          {/* name, email, github_link, grade, rating */}
          <div
            css={css`
              display: flex;
              flex-direction: column;
              justify-content: end;
              gap: 1rem;
            `}
          >
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
              `}
            >
              {/* name */}
              <h2
                css={css`
                  font-weight: 600;
                  font-size: 36px;
                  ${bp[0]} {
                    font-size: 28px;
                  }
                `}
              >
                {profile.name} {convertGradeToMedal(profile.grade)}
              </h2>
              {/* rating, grade */}
              <div
                css={css`
                  display: flex;
                  align-items: center;
                  gap: 0.5rem;
                `}
              >
                <ReactStars count={5} size={16} value={profile.rating} />
                <div>{profile.rating}</div>
              </div>
            </div>
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
                {profile.email}
              </h2>
            </div>
            {/* github_link */}
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
                {profile.github_link}
              </h2>
            </div>
          </div>
          {/* like */}
          <div
            css={css`
              display: flex;
              flex-direction: column;
              justify-content: end;
              padding: 0px 4px;
              font-size: 16px;
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: 0.25rem;
              `}
            >
              <button
                css={css`
                  outline: none;
                  border: none;
                  background-color: white;
                  cursor: pointer;
                `}
              >
                <AiOutlineHeart size="24" color="red" />
              </button>
              <div>{profile.like}</div>
            </div>
          </div>
        </div>
        <div
          css={css`
            width: 100%;
            height: 2px;
            background-color: #cdcdcd;
          `}
        />
        {/* descriptiions */}
        <p
          css={css`
            line-height: 1.6;
          `}
        >
          {profile.short_description}
        </p>
      </div>
    </div>
  );
}
