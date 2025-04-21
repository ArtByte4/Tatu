import { instance } from '@/lib/axiosConfig';

export const logoutClearCookies = async () => {
    try{
        const response = await instance.post('/api/users/auth/logout', {},  { withCredentials: true })
        return response
    }catch (error) {
        console.error('No fue pusible cerrar sesion', error)
    }
} 