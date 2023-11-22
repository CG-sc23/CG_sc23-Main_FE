import { useEffect, useState } from "react";
import { ProjectData } from "@/libs/constant/test";
import styled from "@emotion/styled";
import { bpmax, bpmin } from "@/libs/styles/constants";
import { css } from "@emotion/react";
import Card from "@/components/Card";
import MDEditor from "@uiw/react-md-editor";
import { format } from "date-fns";
import { myProjectStatus } from "@/libs/utils/project";
import { colors } from "@/components/constant/color";
import { Milestone } from "@/components/Projects/Milestone";
import Link from "next/link";
import { FaRegPlusSquare } from "react-icons/fa";
import { milestoneCreationPermitted } from "@/libs/utils/milestone";

const Container = styled.div`
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

type ProjectDetail = {
  project_id: number;
  owner: {
    id: number;
    name: string;
    profile_image_link: string;
  };
  status: string;
  title: string;
  short_description: string;
  description: string;
  description_resource_links?: string[];
  created_at: string;
  due_date: string;
  thumbnail_image: string;
  milestones: {
    id: number;
    subject: string;
    tags: string[];
  }[];
  permission: string;
} | null;

type Props = {
  project_id: number;
};

export default function ProjectDetail({ project_id }: Props) {
  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();

  useEffect(() => {
    setProjectDetail(ProjectData);
  });

  return (
    <Container>
      {/* title, thumbnail_image, short_description */}
      <Card>
        <Block>
          <Header>{projectDetail?.title}</Header>
          <img
            src={projectDetail?.thumbnail_image}
            alt={projectDetail?.title}
            css={css`
              width: 12rem;
              height: 12rem;
              object-fit: contain;
            `}
          />
          <p>{projectDetail?.short_description}</p>
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
              {format(new Date(ProjectData.created_at), "yyyy.MM.dd")}
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
            <span>{format(new Date(ProjectData.due_date), "yyyy.MM.dd")}</span>
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
                color: ${myProjectStatus(ProjectData.status).color};
              `}
            >
              {myProjectStatus(ProjectData.status).text}
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
            source={projectDetail?.description}
            css={css`
              width: 100%;
            `}
          />
        </Block>
      </Card>
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
              마일스톤 목록 ({projectDetail?.milestones.length})
            </SubHeader>
            {milestoneCreationPermitted(projectDetail?.permission) ? (
              <Link href="/milestones/form">
                <FaRegPlusSquare size="24" />
              </Link>
            ) : (
              <></>
            )}
          </div>
          {projectDetail?.milestones.map((milestone) => (
            <Milestone
              id={milestone.id}
              subject={milestone.subject}
              tags={milestone.tags}
            />
          ))}
        </Block>
      </Card>
    </Container>
  );
}
