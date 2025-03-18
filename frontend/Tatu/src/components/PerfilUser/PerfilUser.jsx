import "./PerfilUser.css";

function PerfilUser() {
  return (
    <div className="container_perfilUser">
      <div className="content_perfilUser">
        <div className="seccion_info_perfilUser">
          <div className="container_img_perfilUser">
            <img src="./../../public/img/user_default.png" alt="" />
          </div>
          <div className="section_container_perfilUser">
            <div className="items_perfilUser">
              <span>mikeki</span>
              <div className="btn_edit_perfil">
                <a href="#">Editar perfil</a>
              </div>
            </div>
            <section className="list_describe_perfilUser">
              <ul>
                <li>
                  <div className="item_content">
                    <span>0</span>
                    <span>Publicaciones</span>
                  </div>
                </li>
                <li>
                  <div className="item_content">
                    <span>0</span>
                    <span>Seguidores</span>
                  </div>
                </li>
                <li>
                  <div className="item_content">
                    <span>0</span>
                    <span>seguidos</span>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilUser;
