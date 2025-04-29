import { logoutClearCookies } from '../api/logoutApi.js';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '@/stores'

/**
 * Hook para limpiar la sesión del usuario cerrando sesión y navegando a /login.
 */

interface UseClearSession {
    callLogout: () => Promise<void>;
}

export const useClearSession = () : UseClearSession => {
    
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const callLogout = async (): Promise<void> => {
        try{
            await logoutClearCookies();
            logout();
            navigate("/login");
    
        }catch (error: unknown){
            console.error('Fallo al intentar cerrar sesion', error);
        }
    }
   

    return {
        callLogout
    }
}