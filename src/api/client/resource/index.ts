import { handleClientError } from '@/api/handleError';
import { client as http } from '@/api/instance';
import {
  GetPreSignedURLParamAndAuthToken,
  GetPreSignedURLResponse,
} from '@/libs/type/client';

export const Resources = {
  async preSignedURL(params: GetPreSignedURLParamAndAuthToken) {
    try {
      const { data } = await http.get<GetPreSignedURLResponse>(
        `/api/resource/${encodeURI(params.file_name)}?type=${params.type}`,
        {
          headers: {
            Authorization: `Token ${params.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<GetPreSignedURLResponse>(e);
    }
  },
};
