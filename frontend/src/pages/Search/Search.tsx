import { useEffect, useState } from 'react';
import { useSearch } from '../../features/search/hooks/useSearch';
import { Link } from 'react-router-dom';
import { Nav } from '@/features/navigation';
import { getProfile } from '@/features/profile/api';
import './Search.css';

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchResults, loading, error } = useSearch();

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);

  // cuando cambia el texto, intenta buscar ese perfil
  useEffect(() => {
    const fetchProfile = async () => {
      if (!searchTerm) {
        setProfileImage(null);
        setProfileData(null);
        return;
      }

      const result = await getProfile(searchTerm);
      if ('user_id' in result) {
        setProfileImage(result.image);
        setProfileData(result);
      } else {
        setProfileImage(null);
        setProfileData(null);
      }
    };

    fetchProfile();
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container_explore_page">
      <div className="sidebar">
        <Nav optionsAdmin={false} />
      </div>

      <div className="search-page">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por @..."
            value={searchTerm}
            onChange={handleSearch}
          />

          {loading && <div className="loading">Buscando...</div>}
          {error && <div className="error">{error}</div>}

          {/* 👇 solo se muestra si hay imagen */}
          {profileData && (
            <div className="container-user-suggested">
              <div className="img-user-suggested">
                <img
                  src={profileImage || '/fallback-avatar.png'}
                  alt={profileData.first_name}
                />
                <div className="user-name-suggested">
                  <span className="username">{profileData.first_name}</span>
                  <span className="suggested-text">
                    @{profileData.user_handle}
                  </span>
                </div>
              </div>

              <Link
                to={`/profile/${profileData.user_handle}`}
                className="btn-ver-perfil"
              >
                <div className="btn">Ver perfil</div>
              </Link>
            </div>
          )}

          {!loading && searchTerm && !profileData && (
            <div className="no-results">No se encontró el usuario</div>
          )}
        </div>
      </div>
    </div>
  );
};
