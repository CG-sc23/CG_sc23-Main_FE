/* eslint-disable @next/next/no-img-element */
import { css } from "@emotion/react";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import ReactStars from "react-stars";

import { convertGradeToMedal } from "@/libs/utils/grade";

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
        align-items: center;
        justify-content: center;
      `}
    >
      <div
        css={css`
          width: 672px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          @media (max-width: 512px) {
            width: 448px;
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
              @media (max-width: 512px) {
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
              @media (max-width: 512px) {
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
              gap: 12px;
            `}
          >
            <div
              css={css`
                display: flex;
                flex-direction: column;
                gap: 8px;
              `}
            >
              {/* name */}
              <h2
                css={css`
                  font-weight: 600;
                  font-size: 36px;
                  @media (max-width: 512px) {
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
                  gap: 8px;
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
                gap: 20px;
                font-size: 16px;
              `}
            >
              <img
                src="/mail.png"
                css={css`
                  width: 24px;
                `}
              />
              <h2>{profile.email}</h2>
            </div>
            {/* github_link */}
            <div
              css={css`
                display: flex;
                align-items: center;
                gap: 20px;
                font-size: 16px;
              `}
            >
              <img
                src="/github.png"
                css={css`
                  width: 24px;
                `}
              />
              <h2>{profile.github_link}</h2>
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
                gap: 4px;
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
            display: flex;
            flex-direction: column;
            gap: 4px;
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
