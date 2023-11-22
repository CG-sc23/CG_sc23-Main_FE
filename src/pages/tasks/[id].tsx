import { colors } from '@/components/constant/color';
import { bpmax, breakpoints } from '@/libs/styles/constants';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import MDEditor from '@uiw/react-md-editor';

const MEMBER_LIMIT = 5;
const OVERLAP_NUMBER = 25;

const Container = styled.div`
  position: relative;

  background-color: ${colors.white};
`;

const Article = styled.section`
  box-sizing: border-box;
  position: relative;

  display: flex;
  flex-direction: column;

  width: ${`${breakpoints[3]}px`};
  height: 100%;

  margin: 0 auto;

  ${bpmax[3]} {
    width: 100%;
  }
`;
const Header = styled.div`
  box-sizing: border-box;
  width: 100%;

  padding: 2rem;

  border-bottom: 2px solid ${colors.grey300};

  ${bpmax[3]} {
    padding: 1rem;
  }
`;
const Title = styled.h1`
  font-size: 3.5rem;
  padding: 1rem 0;

  border-bottom: 1px solid ${colors.grey300};
`;
const Info = styled.div`
  width: 100%;
  display: flex;

  padding: 0.5rem 0;

  justify-content: space-between;
  align-items: center;
`;
const Author = styled.div`
  display: flex;
  align-items: center;

  gap: 5px;

  font-size: 1.2rem;
  font-weight: 600;
`;
const AuthorThumbnailWrapper = styled.div`
  position: relative;

  width: 2rem;
  height: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const Date = styled.div`
  font-size: 1.2rem;
`;
const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;

  align-items: flex-start;
  gap: 5px;

  min-height: 36px;

  padding: 0.5rem 0;
`;
const Tag = styled.span`
  font-weight: 300;
  background-color: ${colors.grey50};
  color: ${colors.green400};

  border-radius: 9999px;
  padding: 10px 15px;

  user-select: none;
  cursor: pointer;

  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${colors.grey200};
  }
`;

const Content = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;

  ${bpmax[3]} {
    padding: 1rem;
  }
`;
const MarkdownWrapper = styled.div`
  position: relative;
  flex: 1;

  padding: 1rem 0.5rem;
`;
const Markdown = css({
  height: '100%',
});
const Detail = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 2rem 0.5rem;

  border-top: 2px solid ${colors.grey300};
`;
const DetailLeft = styled.div`
  position: relative;
  height: 100%;

  flex: 1;
  display: flex;
  align-items: center;

  gap: 1rem;
`;
const ProjectThumbnailWrapper = styled.div`
  position: relative;

  width: 8rem;
  height: 8rem;

  display: flex;
  justify-content: center;
  align-items: center;

  ${bpmax[3]} {
    width: 7rem;
    height: 7rem;
  }
`;
const TaskParents = styled.div`
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: 1rem;

  font-weight: bold;
`;
const ProjectTitle = styled.div`
  font-size: 2.5rem;

  ${bpmax[3]} {
    font-size: 2rem;
  }
`;
const MilestoneTitle = styled.div`
  font-size: 2rem;

  ${bpmax[3]} {
    font-size: 1.5rem;
  }
`;
const TaskGroupTitle = styled.div`
  font-size: 1.5rem;

  ${bpmax[3]} {
    font-size: 1rem;
  }
`;
const DetailRight = styled.div`
  display: flex;
  flex-direction: column;

  justify-content: space-between;

  height: 100%;
`;
const DDay = styled.div`
  font-size: 2rem;
  font-weight: bold;
  text-align: right;

  &.plus {
    color: ${colors.blue400};
  }

  ${bpmax[3]} {
    font-size: 1.5rem;
  }
`;
const ThumbnailGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const MemberThumbnailWrapper = styled.div<{ index: number; length: number }>`
  position: relative;

  width: 3rem;
  height: 3rem;

  display: flex;
  display: ${(props) => (props.index < MEMBER_LIMIT + 1 ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;

  border-radius: 9999px;
  overflow: hidden;

  right: ${(props) => {
    const LIMIT = Math.min(props.length, MEMBER_LIMIT);
    const isMore = props.index === MEMBER_LIMIT;
    const isLast = props.length - 1 === props.index;

    return isMore || isLast
      ? '0px'
      : `${-OVERLAP_NUMBER * (LIMIT - props.index) + OVERLAP_NUMBER}px`;
  }};
  z-index: ${(props) => `${props.length - props.index}`};
`;
const More = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: bold;

  border-radius: 9999px;
  background-color: ${colors.white};
  border: 1px solid ${colors.grey300};
`;

// ! DUMMY
const DummyProfileThumbnail = styled.div`
  width: 100%;
  height: 100%;

  border-radius: 9999px;
  background-color: ${(props) => (props.color ? props.color : 'aqua')};
`;
const DummyProjectThumbnail = styled.div`
  width: 8rem;
  height: 8rem;

  border-radius: 9999px;
  background-color: aqua;
`;
const dummyTag = ['234', 'sdg', 'wergt', 'dsfhdf', 'cvbvcxb'];
const dummyMember = [
  'red',
  'black',
  'grey',
  'blue',
  'green',
  'tomato',
  'purple',
  'yellow',
  'brown',
  'aqua',
  'yellowgreen',
  'violet',
  'pink',
];
const dummyMD = `
  # Header 1
  
  ## Header 2

  ### Header 3

  #### Header 4

  body
  # Header 1
  
  ## Header 2

  ### Header 3

  #### Header 4

  body
  # Header 1
  
  ## Header 2

  ### Header 3

  #### Header 4

  body
  # Header 1
  
  ## Header 2

  ### Header 3

  #### Header 4

  body
  # Header 1
  
  ## Header 2

  ### Header 3

  #### Header 4

  body
`;

export default function TaskPage() {
  return (
    <Container>
      <Article>
        <Header>
          <Title>Title</Title>
          <Info>
            <Author>
              <AuthorThumbnailWrapper>
                <DummyProfileThumbnail />
              </AuthorThumbnailWrapper>
              이웅희
            </Author>
            <Date>2020-02-02</Date>
          </Info>
          <TagList>
            {dummyTag.map((val) => (
              <Tag key={val}>{val}</Tag>
            ))}
          </TagList>
        </Header>
        <Content>
          <MarkdownWrapper data-color-mode="light">
            <MDEditor.Markdown source={dummyMD} css={Markdown} />
          </MarkdownWrapper>
        </Content>
        <Detail>
          <DetailLeft>
            <ProjectThumbnailWrapper>
              <DummyProfileThumbnail />
            </ProjectThumbnailWrapper>
            <TaskParents>
              <ProjectTitle>Project Title</ProjectTitle>
              <MilestoneTitle>Milestone Title</MilestoneTitle>
              <TaskGroupTitle>TaskGroup Title</TaskGroupTitle>
            </TaskParents>
          </DetailLeft>
          <DetailRight>
            <DDay className="plus">D-Day +24</DDay>
            <ThumbnailGroup>
              {dummyMember.map((val, idx, origin) => (
                <MemberThumbnailWrapper
                  key={val}
                  index={idx}
                  length={origin.length}
                >
                  {idx < MEMBER_LIMIT ? (
                    <DummyProfileThumbnail color={val} />
                  ) : (
                    <More>+ {origin.length - MEMBER_LIMIT}</More>
                  )}
                </MemberThumbnailWrapper>
              ))}
            </ThumbnailGroup>
          </DetailRight>
        </Detail>
      </Article>
    </Container>
  );
}
