/* eslint-disable */
// @ts-ignore

import type { NextApiResponse, NextApiRequest } from 'next';
import type { HealthCheckResponse } from '@/libs/type/client';
import server from '@/api/server';

export default async function handleHealthCheck(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResponse>,
) {
  if (req.method !== 'GET') return res.status(405).end();

  const _res = await server.getHealthCheck();
  if (!_res) throw Error('API 서버 연결 없음.');

  const { data, status } = _res;
  if (!data.success) {
    return res.status(status).json({
      end_point_ok: true,
      api_ok: false,
    });
  }

  return res.status(200).json({
    end_point_ok: true,
    api_ok: true,
  });
}
