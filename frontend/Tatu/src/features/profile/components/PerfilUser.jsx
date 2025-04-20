import { TbNut } from "react-icons/tb";
import { MdPhotoCamera } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import "../styles/PerfilUser.css";
import { useParams } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";


function PerfilUser() {

  const { username } = useParams();
  const [ownPerfil, setOwnPerfil] = useState(false);
  const {
    user,
    photo,
    profile,
    loading,
    dataFetched,
    setLoading,
    setDataFetched,
    handleGetProfile,
    handleUploadPhotoProfile,
  } = useProfile();
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
      await handleUploadPhotoProfile(formData, encodedKey, username);
      // await handleGetProfile(username)
    } catch (err) {
      console.error("Error al subir imagen o actualizar perfil", err);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const response = await handleGetProfile(username);
        setDataFetched(true);
        if (user.id === response.user_id && user.username == response.user_handle){
          setOwnPerfil(true)
        }
      } catch (error) {
        console.error("Error al obtener los datos del perfil", error);
        // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje de error
      } finally {
        setLoading(false); // Una vez que la carga finaliza, desactiva el estado de loading
      }
    };

    if (username) {
      fetchProfileData(); // Solo realiza la petición si se tiene un username
    }
  }, [username]); // Agrega 'setProfile' como dependencia si lo estás usando desde el store

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

  const handleUploadFile = () => {
    if(ownPerfil){
      fileInputRef.current.click();
    }
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
              <img src={`${profile.image}?${new Date().getTime()}`} alt="" />
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
