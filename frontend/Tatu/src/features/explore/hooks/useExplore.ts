import { useState, useCallback } from "react";
import { fetchUsers } from "../api/exploreApi";

export const useExplore = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para indicar carga

  const handleUsers = useCallback(async () => {
    try {
      setUsers(await fetchUsers());
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
