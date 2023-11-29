import axios from 'axios';

export const server = axios.create({
  baseURL: process.env.API_BASE_URL,
});

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});
