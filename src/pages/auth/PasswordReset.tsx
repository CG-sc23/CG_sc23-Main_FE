import Card from "@/components/Card";
import InputWithLabel from "@/components/InputWithLabel";
import { colors } from "@/components/constant/color";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useState } from "react";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Button = styled.button<{ bgColor?: string }>`
  background: none;
  outline: none;
  border: none;

  padding: 1rem 0;

  background-color: ${(props) =>
    props.bgColor ? props.bgColor : colors.blue300};
  color: ${(props) => (props.color ? props.color : colors.white)};

  border-radius: 5px;
  font-size: larger;
  font-weight: 600;
  cursor: pointer;
`;

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      css={css`
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      `}
    >
      <Card>
        <div
          css={css`
            width: 5rem;
            height: 5rem;
            background-color: aqua;
            margin: auto;
            border-radius: 50%;
          `}
        />
        <Form>
          <span
            css={css`
              padding: 0 2rem;
              font-size: 1.5rem;

              word-break: break-all;
              line-break: auto;
              text-align: center;
            `}
          >
            First, submit your Email
          </span>
          <InputWithLabel
            type="email"
            label="Email"
            value={email}
            setter={setEmail}
          />
          <Button type="submit" bgColor={colors.black}>
            Get Token
          </Button>
        </Form>
      </Card>
    </div>
  );
}
