import styled from "@emotion/styled";
import { colors } from "@/components/constant/color";
import { bpmin } from "@/libs/styles/constants";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  gap: 1rem;

  width: 100%;
  padding: 1rem;

  ${bpmin[0]} {
    padding: 1rem;
    border: none;
    border-radius: 0.2rem;
    box-shadow: 2px 2px 4px ${colors.grey400};
    background-color: white;
    transition: 0.5s;
  }
`;

export default Card;
