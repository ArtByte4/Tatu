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
      setSearchResults(results);
    } catch (err) {
      setError('Error al buscar usuarios');
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