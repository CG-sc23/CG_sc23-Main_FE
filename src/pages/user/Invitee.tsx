import client from '@/api/client';
import useUser from '@/hooks/user/useUser';
import { useQuery } from '@tanstack/react-query';
import styled from '@emotion/styled';
import Link from 'next/link';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/Spinner';
import { bpmax } from '@/libs/styles/constants';
import { colors } from '@/components/constant/color';
import { useState } from 'react';
import useSnackBar from '@/hooks/useSnackBar';

const Container = styled.div`
  position: relative;
  box-sizing: border-box;

  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 2rem 1rem;
`;
const List = styled.ul`
  box-sizing: border-box;
  position: relative;
  width: 896px;
  height: 100%;
  background-color: ${colors.white};

  box-shadow: 2px 2px 4px ${colors.grey400};
  border-radius: 0.2rem;

  padding: 2rem 1rem;

  /* mobile */
  ${bpmax[0]} {
    width: 100%;
  }
`;
const Invitee = styled.li`
  position: relative;
  border: 2px solid ${colors.blue200};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  list-style: none;

  padding: 5px 10px;

  margin-top: 5px;
  &:first-of-type {
    margin-top: 0 !important;
  }
`;
const Info = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;

  gap: 5px;
`;
const ProjectLink = styled(Link)`
  color: ${colors.blue600};
  font-size: 1.5rem;
  font-weight: bold;

  cursor: pointer;
  transition: color 0.2s ease;
  &:hover {
    color: ${colors.blue300};
  }
`;
const Inviter = styled.div`
  color: ${colors.black};
  font-size: 1.2rem;
  font-weight: bold;
`;
const CreatedAt = styled.div`
  color: ${colors.grey400};
  font-size: 1rem;
`;
const Reply = styled.button`
  outline: none;
  border: none;
  background: none;

  height: 100%;

  border-radius: 5px;
  padding: 1rem 2rem;
  font-size: 2rem;

  background-color: ${(props) =>
    props.color === 'green' ? colors.green300 : colors.red300};
  color: ${colors.white};

  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${(props) =>
      props.color === 'green' ? colors.green200 : colors.red200};
  }
`;
const Empty = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 3rem;
  font-weight: bold;

  user-select: none;

  ${bpmax[0]} {
    font-size: 2rem;
  }
`;

export default function InviteePage() {
  const [loading, setLoading] = useState(false);
  const { openSnackBar } = useSnackBar();
  const { accessToken, user, isLoggedIn } = useUser();
  const {
    data,
    isLoading: dataLoading,
    refetch,
  } = useQuery({
    queryKey: ['USER_INFO', 'INVITEE', user?.id],
    queryFn: async () => {
      if (!accessToken) return null;

      const res = await client.projectInvitee({
        token: accessToken,
      });

      if (res?.ok) return res.result;
      return null;
    },
    enabled: !!user && isLoggedIn,
  });

  const onReply = async (
    accept: boolean,
    project_id: number,
    inviter_email: string,
  ) => {
    if (loading) return;
    if (!accessToken) return;
    if (!user?.id) return;

    const res = await client.replyInvitee({
      token: accessToken,
      body: {
        accept,
        inviter_email,
        project_id,
      },
    });

    if (res?.ok) refetch();
    else openSnackBar('요청에 실패하였습니다.');
  };

  return (
    <Container>
      {dataLoading ? (
        <LoadingSpinner />
      ) : (
        <List>
          {data && data.length > 0 ? (
            data.map((d, idx) => (
              <Invitee
                key={`INVITEE_${d.project_id}_${d.inviter_email}_${idx}`}
              >
                <Info>
                  <ProjectLink href={`/projects/${d.project_id}`}>
                    프로젝트 보기
                  </ProjectLink>
                  <Inviter>초대인: {d.inviter_email}</Inviter>
                  <CreatedAt>
                    {format(new Date(d.created_at), 'yyyy.MM.dd')}
                  </CreatedAt>
                </Info>
                <Reply
                  color="green"
                  type="button"
                  onClick={() => onReply(true, d.project_id, d.inviter_email)}
                >
                  수락
                </Reply>
                <Reply
                  color="red"
                  type="button"
                  onClick={() => onReply(false, d.project_id, d.inviter_email)}
                >
                  거절
                </Reply>
              </Invitee>
            ))
          ) : (
            <Empty>받은 초대가 없습니다!</Empty>
          )}
        </List>
      )}
    </Container>
  );
}
