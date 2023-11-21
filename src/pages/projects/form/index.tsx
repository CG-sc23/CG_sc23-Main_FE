import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { bpmax } from "@/libs/styles/constants";
import { SubmitHandler, useForm } from "react-hook-form";
import { InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import useUser from "@/hooks/user/useUser";
import { useRouter } from "next/router";
import Dropzone from "@/components/Dropzone";
import { extractImageLinks } from "@/libs/utils/editor";
import { safeLocalStorage } from "@toss/storage";
import { uploadImg } from "@/libs/utils/s3";
import { queryKey } from "@/libs/constant";
import { colors } from "@/components/constant/color";
import Card from "@/components/Card";
import useSnackBar from "@/hooks/useSnackBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const Container = styled.div`
  width: 896px;
  padding: 1rem;
  display: flex;
  flex-direction: column;

  /* mobile */
  ${bpmax[0]} {
    width: 100%;
    padding: 0;
  }
`;

const Block = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Header = styled.h2`
  width: 100%;
  font-size: 1.6rem;
  font-weight: 500;
`;

const SubHeader = styled.h2`
  width: 100%;
  font-size: 1.2rem;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  padding: 2rem;
  box-sizing: border-box;
  background-color: ${colors.white};
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem;
  border: 1px solid ${colors.grey300};
  border-radius: 0.2rem;
  font-size: 1.2rem;

  &:focus {
    outline: none;
    border: 1px solid black;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem;
  border: 1px solid ${colors.grey300};
  border-radius: 0.2rem;
  font-size: 1.2rem;
  resize: none;

  &:focus {
    outline: none;
    border: 1px solid black;
  }
`;

const Submit = styled.button`
  width: 100%;
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
    background-color: black;
  }
`;

// TODO : need to define Network Request type for typescript
type FormData = Partial<any>;

export default function ProjectForm({}: InferGetServerSidePropsType<any>) {
  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
  const { user: loggedInUser, isLoggedIn } = useUser();
  const { openSnackBar } = useSnackBar();
  const router = useRouter();

  const [shortDescription, setShortDescription] = useState(
    "프로젝트에 대한 간단한 설명을 작성해주세요"
  );
  const [markdown, setMarkdown] = useState("프로젝트 설명을 작성해주세요");
  const [thumbnail, setThumbnail] = useState<string | undefined>();
  const [dueDate, setDueDate] = useState<Date | null>(new Date());

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      title: "프로젝트 제목" as string,
    },
  });

  const onUploadThumbnailImage = async (file: File) => {
    if (!token) return;
    const url = await uploadImg({
      token,
      file,
      filename: file.name,
    });
    setThumbnail(url);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!token) return;

    // TODO : key name for uploadData object might be revisioned
    const uploadData: FormData = {
      ...data,
      short_description: shortDescription,
      description: markdown,
      description_resource_links: JSON.stringify(extractImageLinks(markdown)),
      thumbnail: thumbnail,
      dueDate: dueDate,
    };
    return;
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/");
      openSnackBar("로그인 먼저 해주세요!");
    }
  }, [isLoggedIn]);

  return (
    <Container>
      <Card>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Header>프로젝트 생성</Header>
          {/* 프로젝트 썸네일 */}
          <div
            css={css`
              width: 18rem;
              height: 16rem;
              margin-bottom: 2rem;
            `}
          >
            <Dropzone
              onFileAdded={onUploadThumbnailImage}
              defaultThumbnail={"/project.jpg"}
            />
          </div>
          {/* 프로젝트 제목 */}
          <Block>
            <SubHeader>프로젝트 제목</SubHeader>
            <Input id="title" type="text" {...register("title")} />
          </Block>
          {/* 프로젝트 종료 일자 */}
          <Block>
            <SubHeader>종료 예정 일자</SubHeader>
            <DatePicker
              dateFormat="yyyy.MM.dd"
              shouldCloseOnSelect
              minDate={new Date()}
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              css={css`
                width: 100%;
                padding: 0.5rem;
                box-sizing: border-box;
                outline: none;
                border: 1px solid ${colors.grey300};
                font-size: 1.2rem;
                border-radius: 0.2rem;
                &:focus {
                  border: 1px solid black;
                }
              `}
            />
          </Block>
          {/* 프로젝트 간단 설명 */}
          <Block>
            <SubHeader>간단한 설명</SubHeader>
            <TextArea
              id="short_description"
              rows={3}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
            <div
              css={css`
                position: absolute;
                right: 0.5rem;
                bottom: 0.5rem;
              `}
            >
              <span>{shortDescription.length}</span>
              <span>/</span>
              <span>50</span>
            </div>
          </Block>
          {/* 프로젝트 구체 설명 */}
          <Block>
            <SubHeader>구체적인 설명</SubHeader>
            <Editor markdown={markdown} setMarkdown={setMarkdown} />
          </Block>
          <Submit type="submit">프로젝트 만들기</Submit>
        </Form>
      </Card>
    </Container>
  );
}
