import axios from 'axios';
import { API_BASE_URL, API_HEADERS } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: API_HEADERS
});

export default api;