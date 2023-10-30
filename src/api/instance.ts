import axios from 'axios';

export const server = axios.create({
  baseURL: 'https://api.domowebest.com',
});

export const client = axios.create();
