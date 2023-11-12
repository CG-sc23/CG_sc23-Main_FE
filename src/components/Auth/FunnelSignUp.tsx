import { useState } from "react";
import useSignUpFunnel from "@/hooks/auth/useSignUpFunnel";
import StepSignUp from "./StepSignUp";

const list = [
  { id: "email", title: "이메일을 입력해주세요." },
  { id: "password", title: "비밀번호를 입력해주세요." },
  { id: "name", title: "닉네임일 입력해주세요." },
  { id: "profile_image", title: "프로필 이미지를 등록해주세요." },
  { id: "github_link", title: "깃허브 주소를 입력해주세요." },
  { id: "short_description", title: "간단한 자기소개를 부탁드려요." },
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

  return (
    <Funnel>
      {steps.map((val, idx) => {
        return (
          <Funnel.Step name={val} key={val}>
            <StepSignUp
              step={val}
              stepCount={idx + 1}
              title={getTitle(val)}
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
