import { useState, useEffect, useRef } from "react";
import { Nav } from "@/features/navigation";
import { useSearchUsers, SearchUser } from "@/features/search";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import "./Search.css";

function Search() {
  const { user } = useAuthStore();
  const [query, setQuery] = useState<string>("");
  const { users, loading, search, clearResults } = useSearchUsers();
  const searchRef = useRef<HTMLDivElement>(null);

  // Búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 0) {
        search(query);
      } else {
        clearResults();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search, clearResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    clearResults();
  };

  return (
    <div className="container_search_page">
      <div className="sidebar">
        <Nav optionsAdmin={user?.rol == 3} />
      </div>
      <div className="main-content">
        <div className="search-content">
          <div className="search-header">
            <h2>Buscar</h2>
          </div>

          <div className="search-input-container" ref={searchRef}>
            <div className="search-input-wrapper">
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={query}
                onChange={handleInputChange}
                className="search-input-field"
                autoFocus
              />
              {query && (
                <button className="search-clear-btn" onClick={handleClear}>
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="search-results-container">
            {loading ? (
              <div className="search-loading-state">
                <div className="loading-spinner"></div>
                <p>Buscando...</p>
              </div>
            ) : query.trim().length === 0 ? (
              <div className="search-empty-state">
                <svg
                  className="empty-icon"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <h3>Busca usuarios</h3>
                <p>Encuentra personas por su nombre de usuario, nombre o biografía</p>
              </div>
            ) : users.length === 0 ? (
              <div className="search-no-results">
                <p>No se encontraron usuarios con "{query}"</p>
              </div>
            ) : (
              <div className="search-users-list">
                {users.map((user: SearchUser) => (
                  <Link
                    key={user.user_id}
                    to={`/profile/${user.user_handle}`}
                    className="search-user-card"
                  >
                    <div className="search-user-avatar">
                      <img
                        src={user.image || "/img/userDefault.png"}
                        alt={user.user_handle}
                      />
                    </div>
                    <div className="search-user-info">
                      <div className="search-user-handle">@{user.user_handle}</div>
                      <div className="search-user-name">
                        {user.first_name} {user.last_name}
                      </div>
                      {user.bio && (
                        <div className="search-user-bio">{user.bio}</div>
                      )}
                      {user.follower_count !== undefined && (
                        <div className="search-user-stats">
                          {user.follower_count} {user.follower_count === 1 ? "seguidor" : "seguidores"}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;

