import useUser from '@/hooks/user/useUser';
import styled from '@emotion/styled';
import { bpmax } from '@/libs/styles/constants';
import ProjectCard from '@/components/Projects/ProjectCard';
import ProjectWrapper from '@/components/Projects/ProjectWrapper';
import { GoPlus } from 'react-icons/go';
import { colors } from '@/components/constant/color';
import Link from 'next/link';
import useGetAllProject from '@/hooks/project/useGetAllProject';
import LoadingSpinner from '@/components/Spinner';
import { css } from '@emotion/react';

// Container for projects page
const Container = styled.div`
  width: 896px;
  height: 100%;
  margin: 0 auto;
  padding: 2rem;
  gap: 24px;

  ${bpmax[3]} {
    box-sizing: border-box;
    width: 100%;
  }
  ${bpmax[0]} {
    padding: 0 0.5rem;
  }
`;

// Header for each section
const Button = styled(Link)`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 4rem;
  bottom: 4rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 4rem;
  font-size: 1.5rem;
  font-weight: 500;
  background-color: ${colors.black};
  color: white;
  box-shadow: 5px 5px 10px ${colors.grey500};

  ${bpmax[0]} {
    right: 2rem;
    bottom: 2rem;
  }
  cursor: pointer;

  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.grey800};
  }
`;

export default function Projects() {
  const { user } = useUser();
  const { projects, isLoading } = useGetAllProject();

  return (
    <Container>
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
        <ProjectWrapper>
          {projects?.map((project) => (
            <ProjectCard key={`PROJECT_${project.id}`} project={project} />
          ))}
        </ProjectWrapper>
      )}
      {user ? (
        <Button href="/projects/form">
          <GoPlus size="36" />
        </Button>
      ) : null}
    </Container>
  );
}
