import { colors } from '@/components/constant/color';
import { bpmax, breakpoints } from '@/libs/styles/constants';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import MDEditor from '@uiw/react-md-editor';

const Container = styled.div`
  position: relative;

  width: 100vw;
  height: 100vh;

  background-color: aqua;
`;

const Article = styled.section`
  box-sizing: border-box;
  position: relative;

  display: flex;
  flex-direction: column;

  width: ${`${breakpoints[3]}px`};
  height: 100%;

  margin: 0 auto;

  background-color: yellow;

  ${bpmax[3]} {
    width: 100%;
  }
`;
const Header = styled.div`
  box-sizing: border-box;
  width: 100%;

  padding: 2rem;

  background-color: green;

  ${bpmax[3]} {
    padding: 1rem;
  }
`;
const Title = styled.h1`
  font-size: 3.5rem;
  padding: 1rem 0;

  background-color: pink;
`;
const Info = styled.div`
  background-color: yellow;

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

  background-color: tomato;
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

  background-color: purple;

  ${bpmax[3]} {
    padding: 1rem;
  }
`;
const MarkdownWrapper = styled.div`
  position: relative;
  flex: 1;

  padding: 0 0.5rem;

  background-color: brown;
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

  background-color: tan;
`;
const DetailLeft = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;

  gap: 1rem;

  background-color: blue;
`;
const TaskParents = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  gap: 1rem;

  background-color: yellowgreen;

  font-weight: bold;
`;
const ProjectTitle = styled.div`
  font-size: 2.5rem;
`;
const MilestoneTitle = styled.div`
  font-size: 2rem;
`;
const TaskGroupTitle = styled.div`
  font-size: 1.5rem;
`;
const DetailRight = styled.div`
  display: flex;
  flex-direction: column;

  background-color: blueviolet;

  height: 100%;
`;
const DDay = styled.div``;
const ThumbnailGroup = styled.div`
  display: flex;
  align-items: center;

  width: 10rem;

  background-color: yellow;
`;
const MemberThumbnailWrapper = styled.div<{ index: number; length: number }>`
  position: relative;

  width: 28px;
  height: 28px;

  display: 'flex';
  /* display: ${(props) =>
    props.index < 6 || props.className?.includes('more') ? 'flex' : 'none'}; */
  justify-content: center;
  align-items: center;

  left: ${(props) => `${-15 * props.index}px`};
  z-index: ${(props) => `${props.length - props.index}`};

  &.more {
    display: flex;
    z-index: 0;
  }
`;

// ! DUMMY
const DummyProfileThumbnail = styled.div`
  width: 28px;
  height: 28px;

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
              <DummyProfileThumbnail />
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
          <Detail>
            <DetailLeft>
              <DummyProjectThumbnail />
              <TaskParents>
                <ProjectTitle>Project Title</ProjectTitle>
                <MilestoneTitle>Milestone Title</MilestoneTitle>
                <TaskGroupTitle>TaskGroup Title</TaskGroupTitle>
              </TaskParents>
            </DetailLeft>
            <DetailRight>
              <DDay>D - 24</DDay>
              <ThumbnailGroup>
                {dummyMember.map((val, idx, origin) => (
                  <MemberThumbnailWrapper
                    key={val}
                    index={idx}
                    length={origin.length}
                  >
                    {idx !== 6 ? (
                      <DummyProfileThumbnail color={val} />
                    ) : (
                      <DummyProfileThumbnail color={'white'} className="more">
                        + {origin.length - 6}
                      </DummyProfileThumbnail>
                    )}
                  </MemberThumbnailWrapper>
                ))}
              </ThumbnailGroup>
            </DetailRight>
          </Detail>
        </Content>
      </Article>
    </Container>
  );
}
