import { IoHomeSharp } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { LuMessageCircleMore } from "react-icons/lu";
import { FaCirclePlus } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import logo from "../../../public/img/Logo _ ART BYTE_White.png";
import "./Nav.css";
function Nav() {
  return (
    <div className="container-item-nav">
      <div className="content-items-nav ">
        <div className="logo-tatu-nav">
          <img src={logo} alt="Logo" />
        </div>
        <div className="list-items-nav">
          <div className="item-nav">
            <div className="item-nav-btn">
              <IoHomeSharp color="#fff" size={24} />
              <span>Inicio</span>
            </div>
          </div>
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
          <div className="item-nav">
            <div className="item-nav-btn">
              <LuMessageCircleMore color="#fff" size={24} />
              <span>Mensajes</span>
            </div>
          </div>
          <div className="item-nav">
            <div className="item-nav-btn">
              <FaCirclePlus color="#fff" size={24} />
              <span>Crear</span>
            </div>
          </div>
          <div className="item-nav">
            <div className="item-nav-btn">
              <FaRegUserCircle color="#fff" size={24} />
              <span>Perfil</span>
            </div>
          </div>
        </div>
      </div>

      <div className="btn-menu-nav">
        <div className="item-nav">
          <div className="item-nav-btn">
            <IoMenu color="#fff" size={24} />
            <span>Más</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
