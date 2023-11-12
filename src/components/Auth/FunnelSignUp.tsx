import { useState } from "react";
import useSignUpFunnel from "@/hooks/auth/useSignUpFunnel";
import StepSignUp from "./StepSignUp";

const list = [
  { id: "email", subtitle: "이메일", title: "이메일을 입력해주세요." },
  { id: "password", subtitle: "비밀번호", title: "비밀번호를 입력해주세요." },
  { id: "name", subtitle: "닉네임", title: "닉네임을 입력해주세요." },
  {
    id: "profile_image",
    subtitle: "프로필 이미지",
    title: "프로필 이미지를 등록해주세요.",
  },
  {
    id: "github_link",
    subtitle: "깃허브 링크",
    title: "깃허브 주소를 입력해주세요.",
  },
  {
    id: "short_description",
    subtitle: "간단한 설명",
    title: "간단한 자기소개를 부탁드려요.",
  },
] as const;

const optionalList = ["profile_image", "github_link", "short_description"];

export default function FunnelSignUp() {
  const [current, setCurrent] = useState<string | File>("");
  const [error, setError] = useState("");

  const { Funnel, steps, nextStep, status } = useSignUpFunnel(
    list.map((el) => el.id),
    {
      afterStepChange: setCurrent,
    }
  );

  const isDisabled =
    (current === "" || error !== "") && !optionalList.includes(status);

  const getTitle = (id: string) => list.filter((el) => el.id === id)[0]?.title;

  const getSubTitle = (id: string) =>
    list.filter((el) => el.id === id)[0]?.subtitle;

  return (
    <Funnel>
      {steps.map((val, idx) => {
        return (
          <Funnel.Step name={val} key={val}>
            <StepSignUp
              step={val}
              stepCount={idx + 1}
              title={getTitle(val)}
              subTitle={getSubTitle(val)}
              status={status}
              current={current}
              setCurrent={setCurrent}
              error={error}
              nextStep={nextStep}
              setError={setError}
              isDisabled={isDisabled}
            />
          </Funnel.Step>
        );
      })}
    </Funnel>
  );
}
