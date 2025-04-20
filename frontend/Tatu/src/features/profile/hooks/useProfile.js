import { profileApi } from '../api/profileApi.js';
import { useAuthStore } from "@/stores";
import { useState, useCallback } from 'react';

export const useProfile = () => {

    const { user, photo, profileData } = useAuthStore();
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState({});


    const handleProfile = useCallback(async (username) => {
        try {
            const response = await profileApi(username);
            setProfile(response.data)
        
        } catch (error) {
          console.error("Error al traer usuario", error);
          throw error;
        } finally {
          setLoading(false);
        }
      }, []);


      


    return {
        user,
        photo,
        profile,
        profileData,
        loading,
        setProfile,
        handleProfile
    }
}