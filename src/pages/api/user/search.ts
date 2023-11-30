import server from "@/api/server";
import type { SearchResponse } from "@/libs/type/client";
import type { NextApiResponse, NextApiRequest } from "next";

export default async function handleSearch(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  if (req.method !== "GET") return res.status(405).end();

  if (!req.query?.request_data) return res.status(404).end();
  const request_data = req.query.request_data as string;

  const result = await server.getSearchUser({
    request_data,
  });

  if (result === undefined)
    return res.status(500).json({ ok: false, reason: "서버 통신 없음" });

  if (result.data === undefined)
    return res.status(500).json({ ok: false, reason: "서버 결과 없음" });

  const { data } = result;

  if (!data.success) {
    return res.status(401).json({ ok: false, reason: data.reason });
  }

  return res.status(200).json({
    ok: true,
    result: data?.result,
  });
}
