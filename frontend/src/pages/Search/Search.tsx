import { useEffect, useState } from 'react';
import { useSearch } from '../../features/search/hooks/useSearch';
import { Link } from 'react-router-dom';
import { Nav } from '@/features/navigation';
import { getProfile } from '@/features/profile/api';
import { VITE_API_BASE_URL } from '@/lib/config';
import './Search.css';

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchResults, loading, error, searchForUsers } = useSearch();

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

      try {
        const result = await getProfile(searchTerm);
        console.log('Profile result:', result); // Para debug
        // Verificar que el resultado no sea null/undefined y tenga user_id
        if (result && typeof result === 'object' && 'user_id' in result) {
          setProfileImage(result.image);
          setProfileData(result);
        } else {
          setProfileImage(null);
          setProfileData(null);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileImage(null);
        setProfileData(null);
      }
    };

    fetchProfile();
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Ejecutar búsqueda en el hook
    searchForUsers(e.target.value);
    console.log('Searching for:', e.target.value);  // Para debug del término de búsqueda
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
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={handleSearch}
          />

          {loading && <div className="loading">Buscando...</div>}
          {error && <div className="error">{error}</div>}

          {/* Perfil específico sugerido */}
          {profileData && (
            <>
              <div className="section-title">Perfil con mayor coincidencia @:</div>
              <div className="profile-highlight card">
                <div className="profile-left">
                  <img
                    className="profile-avatar"
                    src={profileData.image ? `${profileData.image}?${new Date().getTime()}` : '/img/userDefault.png'}
                    alt={profileData.first_name}
                  />
                  <div className="profile-meta">
                    <div className="profile-name">{profileData.first_name} {profileData.last_name}</div>
                    <div className="profile-handle">@{profileData.user_handle}</div>
                  </div>
                </div>
                <div className="profile-actions">
                  <Link to={`/profile/${profileData.user_handle}`} className="btn btn-primary">Ver perfil</Link>
                </div>
              </div>
            </>
          )}

          {/* Resultados de búsqueda */}
          {searchResults && searchResults.length > 0 && (
            <>
              <div className="section-title">Resultados de búsqueda:</div>
              <div className="results-grid">
                {searchResults.map((user: any) => (
                  <div className="user-card card" key={user.username}>
                    <div className="card-left">
                      <img
                        className="avatar"
                        src={user.image ? `${user.image}?${new Date().getTime()}` : '/img/userDefault.png'}
                        alt={`${user.first_name} ${user.last_name}`}
                      />
                      <div className="user-info">
                        <div className="name">{user.first_name} {user.last_name}</div>
                        <div className="handle">@{user.username}</div>
                      </div>
                    </div>
                    <div className="card-actions">
                      <Link to={`/profile/${user.username}`} className="btn btn-primary">Ver perfil</Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && searchTerm && (!profileData && searchResults.length === 0) && (
            <div className="no-results-graphic card">
              <div className="no-results-emoji">🔍</div>
              <div>No se encontraron usuarios. Intenta con otro nombre.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
