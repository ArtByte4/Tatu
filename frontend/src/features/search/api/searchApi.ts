import { instance as axios } from '../../../lib/axiosConfig';

export const searchUsers = async (username: string) => {
  try {
    const response = await axios.get(`/api/users/search?username=${encodeURIComponent(username)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};