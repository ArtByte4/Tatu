import { instance as axios } from '../../../lib/axiosConfig';

export const searchUsers = async (username: string) => {
  try {
    const response = await axios.get(`/api/users/search?username=${encodeURIComponent(username)}`);
    console.log('Search API Response:', JSON.stringify(response.data, null, 2));
    
    // Obtener el perfil para cada usuario encontrado
    const usersWithProfiles = await Promise.all(
      response.data.map(async (user: any) => {
        try {
          // Usar el mismo endpoint que usa el perfil individual
          const profileResponse = await axios.get(`/api/users/profile/${user.username}`);
          console.log(`Profile for ${user.username}:`, profileResponse.data);
          return {
            ...user,
            image: profileResponse.data.image
          };
        } catch (error) {
          console.error(`Error getting profile for ${user.username}:`, error);
          return user;
        }
      })
    );
    
    return usersWithProfiles;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};