import { Post } from "../api/postApi";
import "./../styles/PostCard.css";

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
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
              {post.user_handle || "usuario"}
            </span>
            <span className="post-card-time">{formatDate(post.created_at)}</span>
          </div>
        </div>
        {post.tattoo_style_name && (
          <span className="post-card-style">{post.tattoo_style_name}</span>
        )}
      </div>

      {post.images && post.images.length > 0 && (
        <div className="post-card-images">
          {post.images.length === 1 ? (
            <img
              src={post.images[0].src}
              alt="Post"
              className="post-card-single-image"
            />
          ) : (
            <div className="post-card-image-grid">
              {post.images.slice(0, 4).map((image, index) => (
                <div key={image.image_id} className="post-card-grid-item">
                  <img src={image.src} alt={`Post ${index + 1}`} />
                  {index === 3 && post.images && post.images.length > 4 && (
                    <div className="post-card-more-images">
                      +{post.images.length - 4}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="post-card-content">
        <p>{post.post_text}</p>
      </div>

      <div className="post-card-stats">
        <div className="post-card-stat">
          <span className="post-card-stat-number">{post.num_likes}</span>
          <span className="post-card-stat-label">Me gusta</span>
        </div>
        <div className="post-card-stat">
          <span className="post-card-stat-number">{post.num_comments}</span>
          <span className="post-card-stat-label">Comentarios</span>
        </div>
        <div className="post-card-stat">
          <span className="post-card-stat-number">{post.num_repost}</span>
          <span className="post-card-stat-label">Compartidos</span>
        </div>
      </div>
    </div>
  );
};



