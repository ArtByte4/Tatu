import { useState, useCallback } from "react";
import { searchUsers, SearchUser } from "../api/searchApi";

interface UseSearchUsersState {
  users: SearchUser[];
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
}

export const useSearchUsers = (): UseSearchUsersState => {
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string): Promise<void> => {
    if (!query || query.trim().length === 0) {
      setUsers([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchUsers(query.trim());
      setUsers(data);
    } catch (err) {
      console.error("Error al buscar usuarios:", err);
      setError("Error al buscar usuarios");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setUsers([]);
    setError(null);
  }, []);

  return {
    users,
    loading,
    error,
    search,
    clearResults,
  };
};


