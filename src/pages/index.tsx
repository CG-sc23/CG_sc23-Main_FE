import { queryKey } from "@/libs/constant";
import styled from "@emotion/styled";
import { safeLocalStorage } from "@toss/storage";
import { bpmax } from "@/libs/styles/constants";
import { Block } from "@/components/Feed/Block";
import { Commerce } from "@/components/Feed/Commerce";
import { Carousel } from "@/components/Feed/Carousel";
import { Project } from "@/components/Feed/Project";
import { User } from "@/components/Feed/User";
import { Task } from "@/components/Feed/Task";

import { UserDatas, ProjectDatas, TaskDatas } from "@/libs/constant/test";

// Container for main page
const Container = styled.div`
  width: 896px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  /* mobile */
  ${bpmax[0]} {
    width: 100%;
    padding: 0;
    gap: 0;
  }
`;

export default function Home() {
  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);

  return (
    <Container>
      {/* tasks */}
      {TaskDatas.map((task) => (
        <Block>
          <Task
            key={task.id}
            id={task.id}
            title={task.title}
            content={task.content}
            author={task.author}
            projectTitle={task.projectTitle}
            projectId={task.projectId}
            milestoneTitle={task.milestoneTitle}
            milestoneId={task.milestoneId}
            taskGroupTitle={task.taskGroupTitle}
            taskGroupId={task.taskGroupId}
            created_at={task.created_at}
            author_profile={task?.author_profile}
          />
        </Block>
      ))}
      {/* projects */}
      <Block
        hasTitle={true}
        title="프로젝트"
        showChevron={true}
        href="/projects"
      >
        <Carousel>
          {ProjectDatas.map((project) => (
            <Project
              key={project.projectId}
              projectTitle={project.projectTitle}
              projectId={project.projectId}
              likes={project.likes}
              status={project.status}
              thumbnail={project.thumbnail}
              short_description={project.short_description}
            />
          ))}
        </Carousel>
      </Block>
      {/* users */}
      <Block
        hasTitle={true}
        title="사용자 추천"
        showChevron={true}
        href="/users"
      >
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
      {/* tasks */}
      {TaskDatas.map((task) => (
        <Block>
          <Task
            key={task.id}
            id={task.id}
            title={task.title}
            content={task.content}
            author={task.author}
            projectTitle={task.projectTitle}
            projectId={task.projectId}
            milestoneTitle={task.milestoneTitle}
            milestoneId={task.milestoneId}
            taskGroupTitle={task.taskGroupTitle}
            taskGroupId={task.taskGroupId}
            created_at={task.created_at}
            author_profile={task?.author_profile}
          />
        </Block>
      ))}
      {/* users */}
      <Block
        hasTitle={true}
        title="사용자 추천"
        showChevron={true}
        href="/users"
      >
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
    </Container>
  );
}
