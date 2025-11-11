import { useState } from "react";
import { Post } from "../api/postApi";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { MdPhotoCamera } from "react-icons/md";
import { PostModal } from "./PostModal";
import "./../styles/PostGrid.css";

interface PostGridProps {
  posts: Post[];
  isOwnProfile?: boolean;
  onPostDeleted?: () => void;
}

export const PostGrid: React.FC<PostGridProps> = ({ posts, isOwnProfile = false, onPostDeleted }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handlePostDeleted = () => {
    if (onPostDeleted) {
      onPostDeleted();
    }
    handleCloseModal();
  };

  if (posts.length === 0) {
    return (
      <div className="post-grid-empty">
        <p>No hay publicaciones aún</p>
      </div>
    );
  }

  return (
    <>
      <div className="post-grid">
        {posts.map((post) => {
          const hasMultipleImages = post.images && post.images.length > 1;
          const imageCount = post.images?.length || 0;

          return (
            <div
              key={post.post_id}
              className="post-grid-item"
              onClick={() => handlePostClick(post)}
            >
              {post.images && post.images.length > 0 ? (
                <>
                  <img
                    src={post.images[0].src}
                    alt="Post"
                    className="post-grid-image"
                    loading="lazy"
                  />
                  {hasMultipleImages && (
                    <div className="post-grid-multiple-indicator">
                      <MdPhotoCamera className="post-grid-multiple-icon" />
                      <span>{imageCount}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="post-grid-placeholder">
                  <span>Sin imagen</span>
                </div>
              )}
              <div className="post-grid-overlay">
                <div className="post-grid-stats">
                  <div className="post-grid-stat-item">
                    <AiFillHeart className="post-grid-stat-icon" />
                    <span>{post.num_likes || 0}</span>
                  </div>
                  <div className="post-grid-stat-item">
                    <FaRegComment className="post-grid-stat-icon" />
                    <span>{post.num_comments || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PostModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isOwnProfile={isOwnProfile}
        onPostDeleted={handlePostDeleted}
      />
    </>
  );
};


