import { useState, useEffect } from "react";
import { Post } from "../api/postApi";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { CommentsModal } from "./CommentsModal";
import "./../styles/PostCard.css";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post>(post);

  useEffect(() => {
    // Resetear el índice cuando cambia el post
    setCurrentImageIndex(0);
    setCurrentPost(post);
  }, [post.post_id, post]);
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

  return (
    <div className="post-card">
      <div className="post-card-header">
        <div className="post-card-user">
          <img
            src={userImage}
            alt={userName}
            className="post-card-avatar"
          />
          <div className="post-card-user-info">
            <span className="post-card-username">
              <a href={`/profile/${post.user_handle}`} className="link-post-card">
              {post.user_handle || "usuario"}
              </a>
            </span>
            <span className="post-card-time">{formatDate(post.created_at)}</span>
          </div>
        </div>
        {post.tattoo_style_name && (
          <span className="post-card-style">{post.tattoo_style_name}</span>
        )}
      </div>

      {images.length > 0 && (
        <div className="post-card-images">
          {images.length === 1 ? (
            <img
              src={images[0].src}
              alt="Post"
              className="post-card-single-image"
            />
          ) : (
            <div className="post-card-carousel">
              <div className="post-card-carousel-wrapper">
                <img
                  src={images[currentImageIndex].src}
                  alt={`Post ${currentImageIndex + 1}`}
                  className="post-card-carousel-image"
                />
                {hasMultipleImages && (
                  <>
                    {currentImageIndex > 0 && (
                      <button
                        className="post-card-nav-btn post-card-nav-left"
                        onClick={prevImage}
                        aria-label="Imagen anterior"
                      >
                        <MdChevronLeft />
                      </button>
                    )}
                    {currentImageIndex < images.length - 1 && (
                      <button
                        className="post-card-nav-btn post-card-nav-right"
                        onClick={nextImage}
                        aria-label="Imagen siguiente"
                      >
                        <MdChevronRight />
                      </button>
                    )}
                    <div className="post-card-indicators">
                      {images.map((_, index) => (
                        <span
                          key={index}
                          className={`post-card-dot ${
                            index === currentImageIndex ? "active" : ""
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`Ir a imagen ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="post-card-content">
        <p>{post.post_text}</p>
      </div>

      <div className="post-card-stats">
        <div className="post-card-stat">
          <span className="post-card-stat-number">{currentPost.num_likes}</span>
          <span className="post-card-stat-label">Me gusta</span>
        </div>
        <div
          className="post-card-stat post-card-stat-clickable"
          onClick={() => setIsCommentsModalOpen(true)}
          style={{ cursor: "pointer" }}
        >
          <span className="post-card-stat-number">{currentPost.num_comments}</span>
          <span className="post-card-stat-label">Comentarios</span>
        </div>
        <div className="post-card-stat">
          <span className="post-card-stat-number">{currentPost.num_repost}</span>
          <span className="post-card-stat-label">Compartidos</span>
        </div>
      </div>

      <CommentsModal
        post={currentPost}
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        onCommentCountChange={(newCount) => {
          setCurrentPost({ ...currentPost, num_comments: newCount });
        }}
      />
    </div>
  );
};



