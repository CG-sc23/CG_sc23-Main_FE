import axios from 'axios';

export const server = axios.create({
  // baseURL: 'https://api.domowebest.com',
  baseURL: 'http://127.0.0.1:8000',
});

export const client = axios.create();
