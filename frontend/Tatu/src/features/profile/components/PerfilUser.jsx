import { TbNut } from "react-icons/tb";
import { MdPhotoCamera } from "react-icons/md";
import { useEffect, useRef } from "react";
import "../styles/PerfilUser.css";

import axios from "axios";
import { useParams } from 'react-router-dom';
import { useProfile } from "../hooks/useProfile";
function PerfilUser() {
  const { username } = useParams();
  const { user, photo, profile, profileData, handleProfile } = useProfile();
  const fileInputRef = useRef(null);
  const PRIVATE_KEY_IMAGEKIT = import.meta.env.VITE_PRIVATE_KEY_IMAGEKIT;

  const handleFileChange = async (e) => {
    const inputFile = e.target.files[0];
    // const url = URL.createObjectURL(inputFile);
    const formData = new FormData();
    formData.append("file", inputFile);
    formData.append("fileName", `photoPerfil${user.username}`);
    formData.append("folder", "/Usuarios/Perfiles");
    const encodedKey = btoa(`${PRIVATE_KEY_IMAGEKIT}:`);
    try {
      const response = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        formData,
        {
          headers: {
            Authorization: `Basic ${encodedKey}`,
          },
        }
     );
     const uploadedUrl = response.data.url;
    //  setFile(uploadedUrl); // Opcional si quieres mostrar la imagen
     console.log("✅ Imagen subida:", uploadedUrl);
     // 👉 Aquí la pasas directamente
     handleUrlPhotoUpload(uploadedUrl);
    } catch (error) {
      console.error("❌ Error subiendo imagen:", error);
    }
  };

  const handleUrlPhotoUpload = async (url) => {
    try {
      const response = axios.put(
        `http://localhost:3000/api/users/profile/${user.username}/photo`,
        { url: url, id: user.id}
      );

      // console.log("✅ Foto de perfil actualizada en la BD:", response.data);
      console.log(url, user.id, response)
      profileData(url)
    } catch (error) {
      console.error(
        "❌ Error actualizando en la base de datos:", error
      );
    }
  };

  useEffect(() => {
    handleProfile(username);
  }, [username]);

  const handleUploadFile = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container_perfilUser">
      <div className="content_perfilUser">
        <div className="seccion_info_perfilUser">
          <div
            className={
              photo
                ? "container-img-perfilUser-active-img"
                : "container-img-perfilUser"
            }
          >
            <button onClick={handleUploadFile}>
              <img src={profile.image} alt="" />
              <MdPhotoCamera
                className="img-photo"
                color="#fff"
                display={photo ? "none" : "flex"}
              />
            </button>
            <form action="">
              <input
                type="file"
                name="photo-perfil"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </form>
          </div>
          <div className="section_container_perfilUser">
            <div className="items_perfilUser">
              <div className="item">
                <div className="btn-info-account">
                  <span>{`${username}`}</span>
                </div>
                <div className="btn_edit_perfil">
                  <a href="#">Editar perfil</a>
                </div>
                <div className="btn-config">
                  <TbNut fontSize={25} />
                </div>
              </div>
            </div>
            <div className="list_describe_perfilUser">
              <ul>
                <li>
                  <div className="item_content">
                    <span className="num">0</span>
                    <span className="describe_item">Publicaciones</span>
                  </div>
                </li>
                <li>
                  <div className="item_content">
                    <span className="num">0</span>
                    <div className="describe_item">
                      <span>Seguidores</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="item_content">
                    <span className="num">0</span>
                    <div className="describe_item">
                      <span>Seguidos</span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilUser;
