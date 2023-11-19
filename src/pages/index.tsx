import { queryKey } from "@/libs/constant";
import styled from "@emotion/styled";
import { safeLocalStorage } from "@toss/storage";
import { bpmax } from "@/libs/styles/constants";
import { Block } from "@/components/Feed/Block"
import { Commerce } from "@/components/Feed/Commerce";
import { Carousel } from "@/components/Feed/Carousel";
import { Project } from "@/components/Feed/Project";
import { User } from "@/components/Feed/User"

import { UserDatas, ProjectDatas } from "@/libs/constant/test"

// TODO : Project Recommend Carousel, Tasks

// Container for main page
const Container = styled.div`
  width: 896px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  ${bpmax[0]} {
    width: 100%;
    padding: 0;
    gap: 1rem;
  }
`;

export default function Home() {
  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);

  return (
    <Container>
      {/* projects */}
      <Block title="프로젝트" showChevron={true} href="/projects">
        <Carousel>
          {ProjectDatas.map((project) => (
              <Project
                key={project.id}
                title={project.title}
                projectTitle={project.projectTitle}
                projectId={project.id}
                owner={project.owner}
                likes={project.likes}
                created_at={project.created_at}
                id={project.id}
              />
            ))}
        </Carousel>
      </Block>
      {/* users */}
      <Block title="사용자 추천" showChevron={true} href="/users">
        <Carousel>
          {UserDatas.map((user) => (
              <User
                key={user.id}
                name={user.name}
                profile={user.profile}
                short_description={user.short_description}
                id={user.id}
              />
            ))}
        </Carousel>
      </Block>
      {/* commercials */}
      <Commerce imageUrl={undefined} />
    </Container>
  );
}
