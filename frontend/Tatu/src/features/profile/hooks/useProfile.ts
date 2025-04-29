import { getProfile, updateProfile, uploadPhotoProfile } from "../api";
import { useAuthStore } from "@/stores";
import { useState, useCallback } from "react";


export const useProfile = () => {
  // const PRIVATE_KEY_IMAGEKIT = import.meta.env.VITE_PRIVATE_KEY_IMAGEKIT;

  const { user, photo, profileData } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [dataFetched, setDataFetched] = useState(false); // Estado para indicar que los datos fueron cargados

  const handleGetProfile = useCallback(async (username: string) => {
    setLoading(true);
    try {
      const response = await getProfile(username);
      setProfile(response);
      return response
    } catch (error) {
      console.error("Error al traer usuario", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePutProfile = useCallback(async (url: string) => {
    setLoading(true);
    try {
      await updateProfile(user, url) // Actualiza base de datos
      profileData(url); // Actualiza estado global
    } catch (error) {
      console.error("Error al traer usuario", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, profileData]);


  const handleUploadPhotoProfile = useCallback(async (formData:FormData, encodedKey: string, username: string) => {
    setLoading(true);
    try {
      const response = await uploadPhotoProfile(formData, encodedKey);
      const updateUrl = response.data.url;
      await handlePutProfile(updateUrl);
      await handleGetProfile(username);
      setDataFetched(true);
    } catch (error) {
      console.error("Error al traer usuario", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [handlePutProfile, handleGetProfile]);

  

  return {
    user,
    photo,
    profile,
    profileData,
    loading,
    dataFetched,
    setDataFetched,
    setProfile,
    setLoading,
    handleGetProfile,
    handlePutProfile,
    handleUploadPhotoProfile,
  };
};
