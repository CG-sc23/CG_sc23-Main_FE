import styled from '@emotion/styled';
import { bpmax } from '@/libs/styles/constants';
import ProjectCard from '@/components/Projects/ProjectCard';
import ProjectWrapper from '@/components/Projects/ProjectWrapper';

// Container for projects page
const Container = styled.div`
  width: 896px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;

  ${bpmax[0]} {
    box-sizing: border-box;
    width: 100%;
    padding: 0 0.5rem;
  }
`;

// Header for each section
const Button = styled.button`
  font-size: 1.5rem;
  font-weight: 500;
`;

export default function Projects() {
  return (
    <Container>
      <ProjectWrapper>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el) => (
          <ProjectCard id={el} />
        ))}
      </ProjectWrapper>
    </Container>
  );
}
