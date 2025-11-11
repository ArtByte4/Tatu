import { useState, useEffect, useRef } from "react";
import { Post } from "../api/postApi";
import { Comment, getCommentsByPostId, createComment, deleteComment } from "../api/commentApi";
import { useAuthStore } from "@/stores/authStore";
import { MdClose, MdDelete } from "react-icons/md";
import "./../styles/CommentsModal.css";

interface CommentsModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onCommentCountChange?: (newCount: number) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  post,
  isOpen,
  onClose,
  onCommentCountChange,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (isOpen && post) {
      loadComments();
    } else {
      setComments([]);
      setCommentText("");
    }
  }, [isOpen, post]);

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

  useEffect(() => {
    // Scroll al final cuando se agregan comentarios
    if (comments.length > 0) {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const loadComments = async () => {
    if (!post) return;
    setLoading(true);
    try {
      const fetchedComments = await getCommentsByPostId(post.post_id);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !commentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      const newComment = await createComment(post.post_id, {
        content: commentText.trim(),
      });
      setComments([...comments, newComment]);
      setCommentText("");
      
      // Actualizar contador
      if (onCommentCountChange) {
        onCommentCountChange(comments.length + 1);
      }
    } catch (error) {
      console.error("Error al crear comentario:", error);
      alert("Error al crear el comentario. Por favor, intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este comentario?")) {
      return;
    }

    setDeletingId(commentId);
    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c.comment_id !== commentId));
      
      // Actualizar contador
      if (onCommentCountChange) {
        onCommentCountChange(comments.length - 1);
      }
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      alert("Error al eliminar el comentario. Por favor, intenta de nuevo.");
    } finally {
      setDeletingId(null);
    }
  };

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

  if (!isOpen || !post) return null;

  const userImage = post.image || "/img/userDefault.png";
  const userName = post.first_name && post.last_name
    ? `${post.first_name} ${post.last_name}`
    : post.user_handle || "Usuario";

  return (
    <div
      className="comments-modal-overlay"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      tabIndex={-1}
    >
      <div
        className="comments-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="comments-modal-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <MdClose />
        </button>

        <div className="comments-modal-content">
          {/* Header del post */}
          <div className="comments-modal-header">
            <div className="comments-modal-post-info">
              <img
                src={post.images && post.images.length > 0 ? post.images[0].src : userImage}
                alt="Post"
                className="comments-modal-post-image"
              />
              <div className="comments-modal-post-text">
                <div className="comments-modal-post-user">
                  <strong>{post.user_handle || "usuario"}</strong>
                </div>
                <div className="comments-modal-post-content">{post.post_text}</div>
              </div>
            </div>
          </div>

          {/* Lista de comentarios */}
          <div className="comments-modal-list">
            {loading ? (
              <div className="comments-modal-loading">Cargando comentarios...</div>
            ) : comments.length === 0 ? (
              <div className="comments-modal-empty">
                <p>No hay comentarios aún</p>
                <span>Sé el primero en comentar</span>
              </div>
            ) : (
              comments.map((comment) => {
                const commentUserImage = comment.image || "/img/userDefault.png";
                const commentUserName = comment.first_name && comment.last_name
                  ? `${comment.first_name} ${comment.last_name}`
                  : comment.user_handle || "Usuario";
                const isOwnComment = user && comment.user_id === user.id;

                return (
                  <div key={comment.comment_id} className="comments-modal-comment">
                    <img
                      src={commentUserImage}
                      alt={commentUserName}
                      className="comments-modal-comment-avatar"
                    />
                    <div className="comments-modal-comment-content">
                      <div className="comments-modal-comment-header">
                        <span className="comments-modal-comment-username">
                          {comment.user_handle || "usuario"}
                        </span>
                        <span className="comments-modal-comment-text">
                          {comment.content}
                        </span>
                      </div>
                      <div className="comments-modal-comment-footer">
                        <span className="comments-modal-comment-date">
                          {formatDate(comment.created_at)}
                        </span>
                        {isOwnComment && (
                          <button
                            className="comments-modal-comment-delete"
                            onClick={() => handleDelete(comment.comment_id)}
                            disabled={deletingId === comment.comment_id}
                            aria-label="Eliminar comentario"
                          >
                            {deletingId === comment.comment_id ? (
                              "Eliminando..."
                            ) : (
                              <MdDelete />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={commentsEndRef} />
          </div>

          {/* Formulario de comentario */}
          <div className="comments-modal-form-container">
            <form onSubmit={handleSubmit} className="comments-modal-form">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Añade un comentario..."
                className="comments-modal-input"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={!commentText.trim() || submitting}
                className="comments-modal-submit"
              >
                {submitting ? "Publicando..." : "Publicar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

