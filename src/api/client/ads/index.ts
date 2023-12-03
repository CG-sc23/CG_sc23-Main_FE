import { client as http } from '@/api/instance';
import type { AdvertiseResponse } from '@/libs/type/client';
import { handleClientError } from '@/api/handleError';

export const Advertise = {
  async advertise(signal: AbortController) {
    try {
      const { data } = await http.get<AdvertiseResponse>('/api/ads/advertise', {
        signal: signal.signal,
      });

      return data;
    } catch (e) {
      return handleClientError<AdvertiseResponse>(e);
    }
  },
};
