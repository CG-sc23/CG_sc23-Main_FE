import { handleApiError } from '@/api/handleError';
import { server as http } from '@/api/instance';
import {
  GetPreSignedURLApiParamAndAuthToken,
  GetPreSignedURLApiResponse,
} from '@/libs/type/server';

export const Resources = {
  async getPreSignedURL(params: GetPreSignedURLApiParamAndAuthToken) {
    try {
      return await http.get<GetPreSignedURLApiResponse>(
        `/resource/v1/pre-signed-url/${params.file_name}?type=${params.type}`,
        {
          headers: {
            Authorization: `Token ${params.token}`,
          },
        },
      );
    } catch (e) {
      return handleApiError<GetPreSignedURLApiResponse>(e);
    }
  },
};
