import { bpmin } from "@/libs/styles/constants";
import styled from "@emotion/styled";
import Link from "next/link";
import { colors } from "../constant/color";

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
  padding: 0.5rem;
  transition: 0.2s;
  ${bpmin[0]} {
    &:hover {
      transform: scale(1.01);
      background-color: ${colors.grey400};
      color: white;
    }
  }
`;

const Image = styled.img`
  width: 3.5rem;
  height: 3.5rem;
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
      <Image src={profile_image_link ?? "/profile.jpg"} alt={name} />
      <DataWrapper>
        <Name>{name}</Name>
        <Email>{email}</Email>
      </DataWrapper>
    </Container>
  );
}
