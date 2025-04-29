import axios, { AxiosResponse } from 'axios';

interface ImageKitResponse {
  fileId: string;
  name: string;
  url: string;
  size: number;
  filePath: string;
  height: number;
  width: number;
  fileType: string;
  thumbnailUrl: string;
}

/**
 * Sube una imagen de perfil a ImageKit.
 *
 * @param formData - FormData con la imagen y metadatos necesarios.
 * @param encodedKey - Clave codificada en base64 para autorización básica.
 * @returns Respuesta de ImageKit con la información del archivo subido.
 */

export const uploadPhotoProfile = async (
  formData: FormData , 
  encodedKey: string
):Promise<AxiosResponse<ImageKitResponse>> => {
    try {
      const response = await axios.post<ImageKitResponse>(
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
  