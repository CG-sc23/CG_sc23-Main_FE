import styled from "@emotion/styled";
import { bpmax } from "@/libs/styles/constants";
import Card from "@/components/Card";
import { colors } from "@/components/constant/color";
import { Friend } from "@/components/Friends/Friend";
import client from "@/api/client";
import { ChangeEvent, useEffect, useState } from "react";
import { safeLocalStorage } from "@toss/storage";
import { queryKey } from "@/libs/constant";
import { useRouter } from "next/router";
import useSnackBar from "@/hooks/useSnackBar";
import { RecommendedUser } from "@/libs/type/client";

const Container = styled.div`
  height: 100%;
  width: 896px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  /* mobile */
  ${bpmax[0]} {
    width: 100%;
    padding: 0;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const SerachInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  border-radius: 0.2rem;
  border: 1px solid ${colors.grey200};
  outline: none;
  font-size: 1.2rem;
  &:focus {
    border: 1px solid black;
  }
`;

const FriendWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export default function Friends() {
  const token = safeLocalStorage.get(queryKey.USER_ACCESS_TOKEN);
  const router = useRouter();
  const { openSnackBar } = useSnackBar();
  const [search, setSearch] = useState("");
  const [friendData, setFriendData] = useState<RecommendedUser[]>([]);

  // searching handle
  const searchHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    const response = await client.searchUser({
      request_data: e.target.value,
    });

    if (!response?.ok || !response.result) return;

    const { result } = response;
    setFriendData(result);
  };

  // 빈문자열의 경우 recommendation fetch
  const fetchRecommendedUsers = async () => {
    // 로그인이 안되어 있으면 로그인 창으로 유도!
    if (!token) {
      openSnackBar("로그인을 먼저 해주세요!");
      router.replace(`/auth/SignIn`);
      return;
    }

    const { result } = (await client.recommendedUser({ token })) as any;

    setFriendData(result?.users);
  };

  // 초반 OR 빈문자열의 경우 user 가져오기
  useEffect(() => {
    if (search.length === 0) fetchRecommendedUsers();
  }, [search]);

  return (
    <Container>
      <Card>
        <SearchWrapper>
          <SerachInput
            placeholder="친구 이름을 검색해보세요"
            onChange={searchHandler}
          />
        </SearchWrapper>
      </Card>
      <Card>
        <FriendWrapper>
          {friendData.map((friend) => (
            <Friend
              user_id={friend.id}
              email={friend.email}
              name={friend.name}
              profile_image_link={friend.profile_image_link}
              profile_image_updated_at={friend.profile_image_updated_at}
            />
          ))}
        </FriendWrapper>
      </Card>
    </Container>
  );
}
