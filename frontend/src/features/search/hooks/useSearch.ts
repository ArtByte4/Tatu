import { useState } from 'react';
import { searchUsers } from '../api/searchApi';

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchForUsers = async (username: string) => {
    if (!username.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await searchUsers(username);
      console.log('Search results:', JSON.stringify(results, null, 2));  // Mostrar estructura completa
      setSearchResults(results);
    } catch (err: any) {
      // Manejo específico de errores de autenticación
      if (err.response?.status === 401) {
        setError('Sesión expirada. Por favor, vuelve a iniciar sesión.');
      } else {
        setError('Error al buscar usuarios. Por favor, intenta de nuevo.');
      }
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    searchResults,
    searchForUsers
  };
};