import { logoutClearCookies } from '../api/logoutApi.js';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '@/stores'

export const useClearSession = () => {
    
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const callLogout = async () => {
        try{
            await logoutClearCookies();
            logout();
            navigate("/login");
    
        }catch (error){
            console.error('Fallo al intentar cerrar sesion', error);
        }
    }
   

    return {
        callLogout
    }
}