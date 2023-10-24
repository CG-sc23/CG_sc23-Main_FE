import axios from 'axios';

export const server = axios.create({
  baseURL: 'http://43.200.38.207',
});

export const client = axios.create();
