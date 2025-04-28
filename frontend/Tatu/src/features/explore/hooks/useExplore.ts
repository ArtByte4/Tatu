interface UserProfile {
  user_id: number;
  user_handle: string;
  first_name: string;
  last_name: string;
  bio: string;
  birth_day: string;
  gender: string;
  image: string;
  follower_count: number;
  role_id: number;
}

interface UseExploreState {
  users: UserProfile[];  
  loading: boolean;
  handleUsers: () => Promise<void>;
}


import { useState, useCallback } from "react";
import { fetchUsers } from "../api/exploreApi";

export const useExplore = (): UseExploreState => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Estado para indicar carga

  const handleUsers = useCallback(async (): Promise<void> => {
    try {
      const response = await fetchUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error al pedir los usuarios", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    handleUsers,
  };
};
