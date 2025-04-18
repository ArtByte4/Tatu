import { TbNut } from "react-icons/tb";
import { MdPhotoCamera } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import "../styles/PerfilUser.css";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";

function PerfilUser() {
  const [file, setFile] = useState(null);
  const [upload, setUpload] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuthStore();
  const [profile, setProfile] = useState({});
  const PRIVATE_KEY_IMAGEKIT = import.meta.env.VITE_PRIVATE_KEY_IMAGEKIT;

  const handleFileChange = async (e) => {
    const inputFile = e.target.files[0];
    // const url = URL.createObjectURL(inputFile);
    const formData = new FormData();
    formData.append("file", inputFile);
    formData.append("fileName", `photoPerfil${user}`);
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
      // console.log("✅ Imagen subida:", response.data);
      setFile(response.data.url);
    }  catch (error) {
      console.error("❌ Error subiendo imagen:", error);
    }
  };

  const handleUpload = async () => {
    try {
      axios
        .get(`http://localhost:3000/api/users/profile/${user}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        })
        .then((response) => {
          setProfile(response.data);
        });
    } catch (error) {
      console.log("Error al traer el usuario", error);
    }
  };

  useEffect(() => {
    handleUpload();
    if (file) {
      setUpload(true);
    }
  }, [file]);

  const handleUploadFile = () => {
    console.log("yeah");
    fileInputRef.current.click();
  };

  return (
    <div className="container_perfilUser">
      <div className="content_perfilUser">
        <div className="seccion_info_perfilUser">
          <div
            className={
              upload
                ? "container-img-perfilUser-active-img"
                : "container-img-perfilUser"
            }
          >
            <button onClick={handleUploadFile}>
              <img src={upload ? file : profile.image} alt="" />
              <MdPhotoCamera
                className="img-photo"
                color="#fff"
                display={upload ? "none" : "flex"}
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
                  <span>{`${user}`}</span>
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
