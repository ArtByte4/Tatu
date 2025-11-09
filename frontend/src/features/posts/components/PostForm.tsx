import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useCreatePost } from "../hooks/useCreatePost";
import { getTattooStyles, TattooStyle } from "../api/postApi";
import { uploadPhotoProfile } from "@/features/profile/api/uploadPhotoProfile";
import { useAuthStore } from "@/stores/authStore";
import "./../styles/PostForm.css";

interface PostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const { user } = useAuthStore();
  const { createNewPost, loading, error } = useCreatePost();
  const [postText, setPostText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<number>(0);
  const [tattooStyles, setTattooStyles] = useState<TattooStyle[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const PRIVATE_KEY_IMAGEKIT = import.meta.env.VITE_PRIVATE_KEY_IMAGEKIT;

  // Validar variable de entorno al montar el componente (solo en desarrollo)
  useEffect(() => {
    if (import.meta.env.DEV && (!PRIVATE_KEY_IMAGEKIT || PRIVATE_KEY_IMAGEKIT.trim() === '')) {
      console.warn("⚠️ ADVERTENCIA: VITE_PRIVATE_KEY_IMAGEKIT no está definida. Las subidas de imágenes fallarán.");
      console.warn("Por favor, verifica que la variable esté definida en tu archivo .env o .env.local");
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchTattooStyles();
    }
  }, [isOpen]);

  const fetchTattooStyles = async () => {
    try {
      const styles = await getTattooStyles();
      setTattooStyles(styles);
      if (styles.length > 0 && selectedStyle === 0) {
        setSelectedStyle(styles[0].tattoo_styles_id);
      }
    } catch (err) {
      console.error("Error al obtener estilos:", err);
    }
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedImages((prev) => [...prev, ...fileArray]);

      // Crear previews
      fileArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (selectedImages.length === 0) return [];

    // Validar que la variable de entorno esté definida
    if (!PRIVATE_KEY_IMAGEKIT || PRIVATE_KEY_IMAGEKIT.trim() === '') {
      const errorMsg = "❌ Error: VITE_PRIVATE_KEY_IMAGEKIT no está definida en las variables de entorno. Por favor, verifica tu archivo .env";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    const uploadedUrls: string[] = [];
    const encodedKey = btoa(`${PRIVATE_KEY_IMAGEKIT}:`);

    // Log de validación (sin exponer el valor completo por seguridad)
    console.log("🔑 Validación de autenticación ImageKit:", {
      hasPrivateKey: !!PRIVATE_KEY_IMAGEKIT,
      privateKeyLength: PRIVATE_KEY_IMAGEKIT.length,
      encodedKeyLength: encodedKey.length,
      isValidLength: encodedKey.length > 20, // Una clave API válida debería generar un encodedKey mucho más largo
    });

    for (const image of selectedImages) {
      const formData = new FormData();
      formData.append("file", image);
      const fileName = `post_${user?.username}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      formData.append("fileName", fileName);
      formData.append("folder", "/Usuarios/Posts");
      // DEBUG: Si el error persiste, probar sin especificar folder (comentar la línea anterior y descomentar la siguiente)
      // formData.append("folder", "/Usuarios/Perfiles"); // Usar carpeta que funciona para probar

      // Debug: Log FormData contents
      console.log("📤 Subiendo imagen a ImageKit:", {
        fileName,
        folder: "/Usuarios/Posts",
        imageName: image.name,
        imageSize: image.size,
        imageType: image.type,
        encodedKeyLength: encodedKey.length,
      });

      try {
        const response = await uploadPhotoProfile(formData, encodedKey);
        console.log("✅ Imagen subida exitosamente:", response.data.url);
        uploadedUrls.push(response.data.url);
      } catch (err) {
        console.error("❌ Error al subir imagen:", err);
        // Log detallado del error
        if (err instanceof Error && 'response' in err) {
          const axiosError = err as any;
          console.error("Detalles del error:", {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
            message: axiosError.message,
          });
          
          // Si es un error de autenticación, mostrar mensaje específico
          if (axiosError.response?.status === 403 && 
              axiosError.response?.data?.message?.includes("cannot be authenticated")) {
            console.error("🔐 ERROR DE AUTENTICACIÓN:");
            console.error("La variable VITE_PRIVATE_KEY_IMAGEKIT puede estar:");
            console.error("1. No definida en el archivo .env o .env.local");
            console.error("2. Vacía o con valor incorrecto");
            console.error("3. No recargada después de agregarla (reinicia el servidor de desarrollo)");
            console.error("Verifica que la variable esté definida correctamente y reinicia el servidor.");
          }
        } else if (err instanceof Error && err.message.includes("VITE_PRIVATE_KEY_IMAGEKIT")) {
          // Error de validación de variable de entorno
          console.error("🔐 ERROR DE CONFIGURACIÓN:");
          console.error(err.message);
        }
        throw err;
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!postText.trim() || selectedStyle === 0) {
      return;
    }

    setUploading(true);

    try {
      // Subir imágenes primero
      const imageUrls = await uploadImages();

      // Crear el post
      const newPost = await createNewPost({
        post_text: postText,
        tattoo_styles_id: selectedStyle,
        image_urls: imageUrls,
      });

      if (newPost) {
        // Resetear formulario
        setPostText("");
        setSelectedStyle(tattooStyles.length > 0 ? tattooStyles[0].tattoo_styles_id : 0);
        setSelectedImages([]);
        setImagePreviews([]);
        onPostCreated();
        onClose();
      }
    } catch (err) {
      console.error("Error al crear post:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!loading && !uploading) {
      setPostText("");
      setSelectedStyle(tattooStyles.length > 0 ? tattooStyles[0].tattoo_styles_id : 0);
      setSelectedImages([]);
      setImagePreviews([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="post-form-overlay" onClick={handleClose}>
      <div className="post-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="post-form-header">
          <h2>Crear nueva publicación</h2>
          <button className="post-form-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="post-form">
          <div className="post-form-field">
            <label htmlFor="post-text">Texto del post</label>
            <textarea
              id="post-text"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="¿Qué estás pensando?"
              rows={4}
              required
            />
          </div>

          <div className="post-form-field">
            <label htmlFor="tattoo-style">Estilo de tatuaje</label>
            <select
              id="tattoo-style"
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(Number(e.target.value))}
              required
            >
              {tattooStyles.map((style) => (
                <option key={style.tattoo_styles_id} value={style.tattoo_styles_id}>
                  {style.tattoo_styles_name}
                </option>
              ))}
            </select>
          </div>

          <div className="post-form-field">
            <label htmlFor="post-images">Imágenes (opcional)</label>
            <div className="post-form-images">
              <input
                ref={fileInputRef}
                type="file"
                id="post-images"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="post-form-upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Seleccionar imágenes
              </button>

              {imagePreviews.length > 0 && (
                <div className="post-form-preview">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="post-form-preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="post-form-remove-image"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && <div className="post-form-error">{error}</div>}

          <div className="post-form-actions">
            <button
              type="button"
              className="post-form-cancel"
              onClick={handleClose}
              disabled={loading || uploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="post-form-submit"
              disabled={loading || uploading || !postText.trim()}
            >
              {uploading ? "Subiendo..." : loading ? "Creando..." : "Publicar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


