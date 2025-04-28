import axios from 'axios';

export const uploadPhotoProfile = async (formData, encodedKey) => {
    console.log(formData, encodedKey, 'A la verga')
    try {
      const response = await axios.post(
        `https://upload.imagekit.io/api/v1/files/upload`,
        formData,
        {
          headers: {
            Authorization: `Basic ${encodedKey}`,
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error al subir la foto de perfil", error);
      throw error;
    }
  };
  