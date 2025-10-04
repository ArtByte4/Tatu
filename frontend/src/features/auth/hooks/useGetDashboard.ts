import axios from 'axios';

export const getDashborad = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/admin/dashboard', {}, {
  withCredentials: true, // ⬅️ esencial para enviar cookies
});

    return response.data;
    
  } catch (error: any) {
    throw error.response?.data || { mensaje: 'Error al obtener datos del dashboard' };
  }
};
