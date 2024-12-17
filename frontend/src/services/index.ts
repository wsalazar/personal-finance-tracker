// import { createStore } from 'vuex';
import { api } from './api';

export const fetchUser = async () => {
  try {
    const response = await api.get('/auth/user');
    return await response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
