import styled from "@emotion/styled";
import { bpmax } from "@/libs/styles/constants";
import Card from "@/components/Card";
import { colors } from "@/components/constant/color";
import { Friend } from "@/components/Friends/Friend";
import { FriendGroupData } from "@/libs/constant/test";
import client from "@/api/client";
import { Mouse } from "@playwright/test";
import {
  ChangeEvent,
  ChangeEventHandler,
  InputHTMLAttributes,
  MouseEvent,
  useEffect,
  useState,
} from "react";

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
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // searching handle
  const searchHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    setSearchLoading(true);
    setSearch(e.target.value);

    const response = await client
      .searchUser({
        request_data: e.target.value,
      })
      .finally(() => setSearchLoading(false));

    console.log(response);

    if (!response?.ok || !response.result) return;
  };

  // 초반 user 가져오기
  useEffect(() => {});

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
          {FriendGroupData.map((friend) => (
            <Friend
              user_id={friend.user_id}
              email={friend.email}
              name={friend.name}
              profile_image_link={friend.proifle_image_link}
              profile_image_updated_at={friend.profile_image_updated_at}
            />
          ))}
        </FriendWrapper>
      </Card>
    </Container>
  );
}
