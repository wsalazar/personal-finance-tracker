// import { createStore } from 'vuex';
import { api } from './api';

export const fetchUser = async () => {
  const response = await api.get('/auth/user');
  return await response.data;
};
