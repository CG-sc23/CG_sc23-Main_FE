/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const server = axios.create({
  baseURL: 'https://api.domowebest.com',
  // baseURL: 'http://127.0.0.1:8000',
});

export const client = axios.create();

type SourceRequest = {
  [key: string]: Date;
};
const sourceRequest: SourceRequest = {};
client.interceptors.request.use((req) => {
  if (req.method === 'post') {
    const key = `${req.url}$${JSON.stringify(req.data)}`;

    if (sourceRequest[key]) {
      throw new Error(`Automatic cancellation: ${req.url}`); // If the request exists cancel
    } else {
      sourceRequest[key] = new Date(); // Store request key
    }
  }

  return req;
});
