import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
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

export type SchemaKey = 'email' | 'name' | 'password' | 'github_link';
type TypeSchema = Record<SchemaKey, StringSchema>;
export const Schema: TypeSchema = {
  email: EmailSchema,
  name: NameSchema,
  password: PasswordSchema,
  github_link: LinkSchema,
} as const;

function validate(schema: StringSchema, input: string) {
  return safeParse(schema, input, { abortPipeEarly: true });
}

type ValidatedOnChange = {
  schema: StringSchema;
  setValue: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<string>>;
};
export const validatedOnChange =
  ({ schema, setValue, setError }: ValidatedOnChange) =>
  (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const input = target.value;
    setValue(input);

    const result = validate(schema, input);
    if (result.success) return setError('');
    setError(result.issues[0].message);
  };
