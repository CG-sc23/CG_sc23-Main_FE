import styled from '@emotion/styled';
import Link from 'next/link';

type Props = {
  user_id: number;
  email: string;
  name: string;
  profile_image_link: string | null;
  profile_image_updated_at: string | null;
};

const Container = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Image = styled.img`
  width: 4rem;
  height: 4rem;
  object-fit: contain;
`;

const DataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1rem;
`;

const Name = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
`;

const Email = styled.div`
  font-size: 0.8rem;
`;

export function Friend({
  user_id,
  email,
  name,
  profile_image_link,
  profile_image_updated_at,
}: Props) {
  return (
    <Container href={`/user/${user_id}`}>
      <Image src={profile_image_link ?? '/profile.jpg'} alt={name} />
      <DataWrapper>
        <Name>{name}</Name>
        <Email>{email}</Email>
      </DataWrapper>
    </Container>
  );
}
