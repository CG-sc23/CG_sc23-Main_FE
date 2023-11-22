import styled from "@emotion/styled";
import { bpmax, bpmin } from "@/libs/styles/constants";
import { css } from "@emotion/react";
import Card from "@/components/Card";
import MDEditor from "@uiw/react-md-editor";
import { format } from "date-fns";
import { myProjectStatus } from "@/libs/utils/project";
import { colors } from "@/components/constant/color";
import { Milestone } from "@/components/Projects/Milestone";
import useGetProject from "@/hooks/project/useGetProject";
import LoadingSpinner from "@/components/Spinner";
import { milestoneCreationPermitted } from "@/libs/utils/milestone";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export default function ProjectDetail() {
  const { project, isLoading } = useGetProject();

  const [newMilestone, setNewMilestone] = useState("");
  const [dueDate, setDueDate] = useState(new Date());

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
                  {project?.created_at &&
                    format(new Date(project.created_at), "yyyy.MM.dd")}
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
                  {project?.due_date &&
                    format(new Date(project?.due_date), "yyyy.MM.dd")}
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
                    myProjectStatus(project?.status, "프로젝트").color};
                  `}
                >
                  {project?.status &&
                    myProjectStatus(project?.status, "프로젝트").text}
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
              <form
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
                  required
                  placeholder="새로운 마일스톤명 입력"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                />
                <DatePicker
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
                <button
                  type="submit"
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
                >
                  생성
                </button>
              </form>
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
              </div>
              {project?.milestone?.map((milestone) => (
                <Milestone
                  id={milestone.id}
                  subject={milestone.subject}
                  tags={milestone.tags}
                />
              ))}
            </Block>
          </Card>
        </>
      )}
    </Container>
  );
}
