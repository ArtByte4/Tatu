import { useState, useEffect } from "react";
import { Post } from "../api/postApi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
import "./../styles/PostModal.css";

interface PostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ post, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (post && post.images) {
      setCurrentImageIndex(0);
    }
  }, [post]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !post) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "hace un momento";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `hace ${days} ${days === 1 ? "día" : "días"}`;
    } else {
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const userImage = post.image || "/img/userDefault.png";
  const userName = post.first_name && post.last_name
    ? `${post.first_name} ${post.last_name}`
    : post.user_handle || "Usuario";

  const images = post.images || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowLeft" && hasMultipleImages) {
      prevImage();
    } else if (e.key === "ArrowRight" && hasMultipleImages) {
      nextImage();
    }
  };

  return (
    <div 
      className="post-modal-overlay" 
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="post-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="post-modal-close" onClick={onClose} aria-label="Cerrar">
          <MdClose />
        </button>

        <div className="post-modal-content">
          {/* Sección de imagen */}
          <div className="post-modal-image-section">
            {images.length > 0 ? (
              <div className="post-modal-image-wrapper">
                <img
                  src={images[currentImageIndex].src}
                  alt={`Post ${currentImageIndex + 1}`}
                  className="post-modal-image"
                />
                
                {hasMultipleImages && (
                  <>
                    {currentImageIndex > 0 && (
                      <button
                        className="post-modal-nav post-modal-nav-left"
                        onClick={prevImage}
                        aria-label="Imagen anterior"
                      >
                        <MdChevronLeft />
                      </button>
                    )}
                    {currentImageIndex < images.length - 1 && (
                      <button
                        className="post-modal-nav post-modal-nav-right"
                        onClick={nextImage}
                        aria-label="Siguiente imagen"
                      >
                        <MdChevronRight />
                      </button>
                    )}
                    <div className="post-modal-image-indicator">
                      {images.map((_, index) => (
                        <span
                          key={index}
                          className={`post-modal-dot ${
                            index === currentImageIndex ? "active" : ""
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="post-modal-placeholder">
                <span>Sin imagen</span>
              </div>
            )}
          </div>

          {/* Sección de información */}
          <div className="post-modal-info-section">
            {/* Header del usuario */}
            <div className="post-modal-header">
              <div className="post-modal-user">
                <img
                  src={userImage}
                  alt={userName}
                  className="post-modal-avatar"
                />
                <div className="post-modal-user-info">
                  <span className="post-modal-username">
                    {post.user_handle || "usuario"}
                  </span>
                  {post.tattoo_style_name && (
                    <span className="post-modal-style">{post.tattoo_style_name}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Contenido del post */}
            <div className="post-modal-body">
              <div className="post-modal-text">
                <strong>{post.user_handle || "usuario"}</strong> {post.post_text}
              </div>

              {/* Estadísticas */}
              <div className="post-modal-stats">
                <div className="post-modal-stat-item">
                  <AiFillHeart className="post-modal-stat-icon" />
                  <span>{post.num_likes || 0} me gusta</span>
                </div>
                <div className="post-modal-stat-item">
                  <FaRegComment className="post-modal-stat-icon" />
                  <span>{post.num_comments || 0} comentarios</span>
                </div>
                {post.num_repost > 0 && (
                  <div className="post-modal-stat-item">
                    <span>{post.num_repost} compartidos</span>
                  </div>
                )}
              </div>

              {/* Fecha */}
              <div className="post-modal-date">
                {formatDate(post.created_at)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


