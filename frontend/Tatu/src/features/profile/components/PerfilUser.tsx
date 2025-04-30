import { TbNut } from "react-icons/tb";
import { MdPhotoCamera } from "react-icons/md";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import "../styles/PerfilUser.css";
import { useParams } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";

interface UserProfile {
  user_id: number;
  user_handle: string;
  image: string;
  bio: string;
  first_name: string;
}

function PerfilUser() {
  const { username } = useParams<{username: string}>();
  if (!username) {
    return <div className="error">No se ha proporcionado un nombre de usuario</div>;
  }
  const [ownPerfil, setOwnPerfil] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const PRIVATE_KEY_IMAGEKIT = import.meta.env.VITE_PRIVATE_KEY_IMAGEKIT;

  const {
    user,
    profile,
    loading,
    dataFetched,
    setLoading,
    setDataFetched,
    handleGetProfile,
    handleUploadPhotoProfile,
  } = useProfile();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0 && user?.username) {
      const inputFile = files[0];
      const formData = new FormData();
      formData.append("file", inputFile);
      formData.append("fileName", `photoPerfil${user.username}`);
      formData.append("folder", "/Usuarios/Perfiles");
  
      const encodedKey = btoa(`${PRIVATE_KEY_IMAGEKIT}:`);
  
      try {
        await handleUploadPhotoProfile(formData, encodedKey, username);
      } catch (err) {
        console.error("Error al subir imagen o actualizar perfil", err);
      }
    } else {
      console.warn("Archivo no seleccionado o usuario no definido");
    }
  };


  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response: UserProfile = await handleGetProfile(username);
        if(response.user_handle != username){
          setDataFetched(false);
          return;
        }
        setDataFetched(true);
        if (
          user?.id === response.user_id &&
          user?.username == response.user_handle
        ) {
          setOwnPerfil(true);
          setFileName(
            response.image
              .split("?")[0]
              .substring(response.image.split("?")[0].lastIndexOf("/") + 1)
          );
        }
      } catch (error) {
        console.error("Error al obtener los datos del perfil", error);
      } finally {
        setLoading(false); // Una vez que la carga finaliza, desactiva el estado de loading
      }
    };

    if (username) {
      fetchProfileData(); // Solo realiza la petición si se tiene un username
    }
  }, [username]); // Agrega 'setProfile' como dependencia si lo estás usando desde el store

  const handleUploadFile = () => {
    if (ownPerfil && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!dataFetched) {
    return (
      <div className="error">
        <p>
          No se pudo obtener los datos del perfil <br /> {username}
        </p>
      </div>
    );
  }
  return (
    <div className="container_perfilUser">
      <div className="content_perfilUser">
        <div className="seccion_info_perfilUser">
          <div
            className={
              fileName === "user_default2.png" && ownPerfil
                ? "container-img-perfilUser"
                : "container-img-perfilUser-active-img"
            }
          >
            <button onClick={handleUploadFile}>
              <img src={`${profile.image}?${new Date().getTime()}`} alt="" />
              <MdPhotoCamera
                className="img-photo"
                color="#fff"
                display={
                  fileName == "user_default2.png" && ownPerfil ? "flex" : "none"
                }
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
