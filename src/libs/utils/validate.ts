import {
  type StringSchema,
  email,
  minLength,
  safeParse,
  string,
} from 'valibot';

const EmailSchema = string('Your email must be a string.', [
  minLength(1, 'Please enter your email.'),
  email('The email address is badly formatted.'),
]);

const PasswordSchema = string('패스워드 틀림요', [
  minLength(1, 'Please enter your password.'),
]);

const NameSchema = string('이름을 입력하세요.', [
  minLength(1, 'Please enter your name.'),
]);

const LinkSchema = string('링크 틀림요', [
  minLength(1, 'Please enter your link.'),
]);

type TypeSchema = {
  [key: string]: StringSchema;
};
export const Schema: TypeSchema = {
  email: EmailSchema,
  name: NameSchema,
  password: PasswordSchema,
  github_link: LinkSchema,
} as const;

export default function validate(schema: StringSchema, input: string) {
  return safeParse(schema, input, { abortPipeEarly: true });
}
