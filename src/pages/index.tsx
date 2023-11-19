import { queryKey } from "@/libs/constant";
import styled from "@emotion/styled";
import { safeLocalStorage } from "@toss/storage";
import { bpmax } from "@/libs/styles/constants";
import { Commerce } from "@/components/Feed/Commerce";
import { UserCarousel } from "@/components/Feed/UserCarousel";
import { Project } from "@/components/Feed/Project";

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
      <Project
        title="나는 프론트엔드가 싫어요"
        projectId="1234"
        projectTitle="인증/인가"
        author="임준혁"
        likes={12}
      />
      <Project
        title="나는 프론트엔드가 싫어요"
        projectId="1234"
        projectTitle="인증/인가"
        author="임준혁"
        likes={12}
      />
      <Project
        title="나는 프론트엔드가 싫어요"
        projectId="1234"
        projectTitle="인증/인가"
        author="임준혁"
        likes={12}
      />
      <UserCarousel />
      <Commerce imageUrl={undefined} />
    </Container>
  );
}
