import { SearchUser } from "../api/searchApi";
import "../styles/SearchResults.css";
import { Link } from "react-router-dom";

interface SearchResultsProps {
  users: SearchUser[];
  loading: boolean;
  query: string;
}

function SearchResults({ users, loading, query }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="search-results">
        <div className="search-results-loading">Buscando...</div>
      </div>
    );
  }

  if (query.trim().length === 0) {
    return null;
  }

  if (users.length === 0) {
    return (
      <div className="search-results">
        <div className="search-results-empty">
          No se encontraron usuarios con "{query}"
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-results-header">
        {users.length} {users.length === 1 ? "resultado" : "resultados"}
      </div>
      <div className="search-results-list">
        {users.map((user) => (
          <Link
            key={user.user_id}
            to={`/profile/${user.user_handle}`}
            className="search-result-item"
          >
            <div className="search-result-avatar">
              <img src={user.image || "/img/userDefault.png"} alt={user.user_handle} />
            </div>
            <div className="search-result-info">
              <div className="search-result-handle">@{user.user_handle}</div>
              <div className="search-result-name">
                {user.first_name} {user.last_name}
              </div>
              {user.bio && (
                <div className="search-result-bio">{user.bio}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;


