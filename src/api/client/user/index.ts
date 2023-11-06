import { client as http } from '@/api/instance';

import { handleClientError } from '@/api/handleError';
import { DeactivateAuthToken, DeactivateResponse } from '@/libs/type/client';

export const Deactivate = {
  async deactivate(param: DeactivateAuthToken) {
    try {
      const { data } = await http.delete<DeactivateResponse>(
        '/api/user/deactivate',
        {
          headers: {
            Authorization: `Token ${param.token}`,
          },
        },
      );

      return data;
    } catch (e) {
      return handleClientError<DeactivateResponse>(e);
    }
  },
};
