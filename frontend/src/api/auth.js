import axios from 'axios';
import { ENDPOINTS } from './endpoints';

export const getUserData = async (token) => {
  const response = await axios.get(ENDPOINTS.USER_DATA, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};