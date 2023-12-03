import { server as http } from '@/api/instance';
import type { GetAdvertiseApiResponse } from '@/libs/type/server';
import { handleApiError } from '@/api/handleError';

export const Advertise = {
  async getAdvertise() {
    try {
      return await http.get<GetAdvertiseApiResponse>('/ads/v1/active');
    } catch (e) {
      return handleApiError<GetAdvertiseApiResponse>(e);
    }
  },
};
