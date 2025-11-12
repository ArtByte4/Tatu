import { useState, useEffect, useRef } from "react";
import { useSearchUsers } from "../hooks/useSearchUsers";
import SearchResults from "./SearchResults";
import "../styles/SearchBar.css";

function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
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
    }, 300); // 300ms de delay

    return () => clearTimeout(timeoutId);
  }, [query, search, clearResults]);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsFocused(true);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleClear = () => {
    setQuery("");
    clearResults();
    setIsFocused(false);
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="search-input"
        />
        {query && (
          <button className="search-clear" onClick={handleClear}>
            ×
          </button>
        )}
        {loading && <div className="search-loading">Buscando...</div>}
      </div>
      {isFocused && (query.trim().length > 0 || users.length > 0) && (
        <SearchResults users={users} loading={loading} query={query} />
      )}
    </div>
  );
}

export default SearchBar;


