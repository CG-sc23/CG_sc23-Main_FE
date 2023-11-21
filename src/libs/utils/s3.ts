import axios from 'axios';
import { AWSResponse } from '../type/client';
import { assert } from './assert';
import client from '@/api/client';

const S3_LINK = '/s3';

type S3Upload = {
  awsField: AWSResponse['fields'];
  file: File;
};

const s3Upload = async ({ awsField, file }: S3Upload) => {
  const formData = new FormData();

  Object.entries(awsField).forEach((s) => {
    const [key, val] = s;

    formData.append(key, val);
  });
  formData.append('file', file);

  try {
    await axios.post(S3_LINK, formData);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const uploadImg = async ({
  file,
  filename,
  token,
  type = 'resource',
}: {
  file: File;
  filename: string;
  token: string;
  type?: 'resource' | 'profile';
}) => {
  const res = await client.preSignedURL({
    token,
    file_name: filename,
    type,
  });

  if (!res) return;
  if (!res.ok) return;

  assert(res.aws_response?.fields, 'No AWS Filed');
  assert(res.aws_response?.url, 'No AWS URL');
  assert(res.url, 'No Image URL');

  const isSuccess = await s3Upload({
    awsField: res.aws_response?.fields,
    file,
  });

  if (isSuccess) return res.url;
};
