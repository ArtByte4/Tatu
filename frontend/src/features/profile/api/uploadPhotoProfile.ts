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
      // Log detallado para errores de ImageKit
      if (axios.isAxiosError(error)) {
        console.error("Detalles del error de ImageKit:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
        });
        // Si es un 403, mostrar información específica
        if (error.response?.status === 403) {
          console.error("⚠️ Error 403 - Posibles causas:");
          console.error("1. La carpeta especificada no existe o no tiene permisos");
          console.error("2. La API key no tiene acceso a la carpeta");
          console.error("3. Restricciones de 'allowed folders' en la configuración de ImageKit");
          console.error("Respuesta de ImageKit:", error.response?.data);
        }
      }
      throw error;
    }
  };
  