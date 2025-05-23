
import {instance} from "../../../lib/axiosConfig";
export const deleteUser = async (user_id: number) => {
    console.log('YEaah')
  try {
    const response = await instance.delete(`api/admin/dasboard/deleteUser/${user_id}`,  {
      withCredentials: true, 
    });

    console.log('Usuario eliminado:', response.data);
    alert('Usuario eliminado correctamente');
  } catch (error: any) {
    console.error('Error al eliminar usuario:', error);
    alert(error.response?.data?.mensaje || 'Error al eliminar');
  }
};