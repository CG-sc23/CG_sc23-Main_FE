import type { NextApiResponse, NextApiRequest } from 'next';
import { createReadStream } from 'fs';
import formidable from 'formidable';
import FormData from 'form-data';

import server from '@/api/server';
import { SignUpResponse } from '@/libs/type/client';

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 10_000_000,
  maxFieldsSize: 10_000_000,
  maxFields: 7,
  allowEmptyFiles: false,
  multiples: false,
};

function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0],
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((accept, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return accept({ fields, files });
    });
  });
}

function appendFormData(
  form: FormData,
  elements: formidable.Fields<string> | formidable.Files<string>,
) {
  Object.entries(elements).forEach((element) => {
    const [key, values] = element;
    if (values === undefined) return;

    const [val] = values;
    form.append(key, val.filepath ? createReadStream(val.filepath) : val);
  });
}

export default async function handleSignUp(
  req: NextApiRequest,
  res: NextApiResponse<SignUpResponse>,
) {
  if (req.method !== 'POST') return res.status(405).end();
  const { fields, files } = await formidablePromise(req, formidableConfig);

  const form = new FormData();
  appendFormData(form, fields);
  appendFormData(form, files);

  const result = fields.pre_access_token
    ? await server.postSocialSignUp(form)
    : await server.postSignUp(form);
  if (result === undefined)
    return res.status(500).json({ ok: false, reason: '서버 연결 없음' });

  const { data, status } = result;

  if (status === 400) {
    return res.status(400).json({ ok: false, reason: data?.reason });
  }

  return res.status(201).json({ ok: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
