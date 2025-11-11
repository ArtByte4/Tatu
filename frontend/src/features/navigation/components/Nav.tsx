import { IoHomeSharp } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { LuMessageCircleMore } from "react-icons/lu";
import { FaCirclePlus } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link } from "react-router-dom";
import { MoreOptions } from "./index.js";
import { PostForm } from "@/features/posts/components/PostForm";
import "../styles/Nav.css";
import { useAuthStore } from "@/stores";
import { useState, useRef, useEffect } from "react";

interface NavProps {
  optionsAdmin: boolean;
}

function Nav({ optionsAdmin }: NavProps) {
  const { user, photo } = useAuthStore();
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const optionClick = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        optionClick.current &&
        !optionClick.current.contains(e.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    // Escucha el evento solo si el menú está abierto
    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Limpieza del evento
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  return (
    <div className="container-item-nav">
      <div className="content-items-nav ">
        <div className="logo-tatu-nav">
          <img src={"/img/Logo _ ART BYTE_White.png"} alt="Logo" />
        </div>
        <div className="list-items-nav">
          <Link to="/">
            <div className="item-nav">
              <div className="item-nav-btn">
                <IoHomeSharp color="#fff" size={24} />
                <span>Inicio</span>
              </div>
            </div>
          </Link>
          <div className="item-nav">
            <div className="item-nav-btn">
              <IoSearch color="#fff" size={24} />
              <span>Búsqueda</span>
            </div>
          </div>
          <div className="item-nav">
            <div className="item-nav-btn">
              <MdOutlineExplore color="#fff" size={24} />
              <span>Explorar</span>
            </div>
          </div>
          <Link to="/messages">
            <div className="item-nav">
              <div className="item-nav-btn">
                <LuMessageCircleMore color="#fff" size={24} />
                <span>Mensajes</span>
              </div>
            </div>
          </Link>
          <div className="item-nav" onClick={() => setIsPostFormOpen(true)}>
            <div className="item-nav-btn">
              <FaCirclePlus color="#fff" size={24} />
              <span>Crear</span>
            </div>
          </div>
          {optionsAdmin && (
            <Link to="/admin/dashboard">
              <div className="item-nav">
                <div className="item-nav-btn">
                  <MdAdminPanelSettings color="#fff" size={24} />
                  <span>Dasboard</span>
                </div>
              </div>
            </Link>
          )}
          <Link to={`/profile/${user?.username}`}>
            <div className="item-nav">
              <div className="item-nav-btn">
                {!photo && <FaRegUserCircle color="#fff" size={24} />}
                {photo && (
                  <img src={photo} alt="Perfil" className="img-perfil-nav" />
                )}
                <span>Perfil</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="btn-menu-nav" ref={optionClick}>
        {showOptions && <MoreOptions />}
        <div
          className="item-nav"
          onClick={() => {
            setShowOptions((prev) => !prev);
          }}
        >
          <div className="item-nav-btn">
            <IoMenu color="#fff" size={24} />
            <span>Más</span>
          </div>
        </div>
      </div>
      {/* Formulario modal para crear publicación desde la barra de navegación */}
      <PostForm
        isOpen={isPostFormOpen}
        onClose={() => setIsPostFormOpen(false)}
        onPostCreated={() => setIsPostFormOpen(false)}
      />
    </div>
  );
}

export default Nav;
