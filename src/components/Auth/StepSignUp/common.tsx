import styled from '@emotion/styled';
import { colors } from '@/components/constant/color';

export const Header = styled.h1`
  margin-bottom: 3rem;
  font-weight: 500;
  font-size: 1.5rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

export const DropZoneWrapper = styled.div`
  width: 18rem;
  height: 16rem;
  margin-bottom: 2rem;
`;

export const Button = styled.button`
  width: 100%;
  padding: 0.8rem 0;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  color: ${colors.white};
  background-color: ${(props) =>
    props.disabled ? colors.grey500 : colors.black};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s ease;
  :hover {
    background-color: ${(props) =>
      props.disabled ? colors.grey600 : colors.grey700};
  }
`;
