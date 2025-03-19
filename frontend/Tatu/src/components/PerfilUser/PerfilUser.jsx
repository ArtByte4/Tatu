import "./PerfilUser.css";
import { TbNut } from "react-icons/tb";
import { MdPhotoCamera } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
function PerfilUser() {
  const [file, setFile] = useState(null);
  const [upload, setUpload] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    // setFile();
    // if (!file) return;
    const url = URL.createObjectURL(e.target.files[0]);
    setFile(url)
    // setUpload(url);
    // console.log(url);
  };

  useEffect (() => {
    console.log(file)
    if(file){
      setUpload(true)
    }
  }, [file])

  const handleUploadFile = () => {
    console.log("yeah");
    fileInputRef.current.click();
  };

  return (
    <div className="container_perfilUser">
      <div className="content_perfilUser">
        <div className="seccion_info_perfilUser">
          <div className={upload ? "container-img-perfilUser-active-img" : "container-img-perfilUser"}>
            <button onClick={handleUploadFile}>
              <img
                src={upload ? file : "./../../public/img/user_default2.png"}
                alt=""
              />
              <MdPhotoCamera className="img-photo" color="#fff" display={upload ? 'none' : 'flex'} />
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
                  <span>mikeki</span>
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
