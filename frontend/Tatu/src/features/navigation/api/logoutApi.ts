import { instance } from '@/lib/axiosConfig';

interface LogoutResponse {  
    message: string;
}

export const logoutClearCookies = async () => {
    try{
        const response = await instance.post<LogoutResponse>('/api/users/auth/logout', {},  { withCredentials: true })
        return response
    }catch (error) {
        console.error('No fue pusible cerrar sesion', error)
    }
} 