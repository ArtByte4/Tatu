import { useState, useEffect } from "react";
import { Nav } from "@/features/navigation"
import { PostForm, PostCard, usePosts } from "@/features/posts";
import "./Explore.css";
import { useAuthStore } from "@/stores/authStore";
import { PeopleExplore } from "@/features/explore";

function Explore() {
  const { user, isAuthenticated } = useAuthStore();
  const { posts, loading, fetchPosts } = usePosts();
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  useEffect(() => {
    // Solo cargar posts si el usuario está autenticado
    if (isAuthenticated && user) {
      console.log("👤 Usuario autenticado, cargando posts...", { userId: user.id, username: user.username });
      fetchPosts();
    } else {
      console.warn("⚠️ Usuario no autenticado, no se pueden cargar posts");
    }
  }, [fetchPosts, isAuthenticated, user]);

  const handlePostCreated = () => {
    fetchPosts();
  };

  return (
    <div className="container_explore_page">
      <div className="sidebar">
       <Nav optionsAdmin={user?.rol == 3}/>
      </div>
      <div className="main-content">
        <div className="explore-content">
          <div className="explore-header">
            <h2>Inicio</h2>
            <button 
              className="create-post-btn"
              onClick={() => setIsPostFormOpen(true)}
            >
              + Crear publicación
            </button>
          </div>
          
          <div className="content-explore">
            <div className="posts-feed">
              {loading ? (
                <div className="posts-loading">Cargando publicaciones...</div>
              ) : posts.length === 0 ? (
                <div className="posts-empty">
                  <p>No hay publicaciones aún. ¡Sé el primero en publicar!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.post_id} post={post} />
                ))
              )}
            </div>
            <PeopleExplore options={false}/>

          </div>

        </div>

      </div>
      
      <PostForm
        isOpen={isPostFormOpen}
        onClose={() => setIsPostFormOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}

export default Explore;
