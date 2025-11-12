import { useState, useCallback } from "react";
import {
  fetchAllUsers,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
  type AdminUser,
  type CreateUserData,
  type UpdateUserData,
} from "../api/adminApi";

interface UseAdminUsersState {
  users: AdminUser[];
  loading: boolean;
  error: string | null;
  loadUsers: () => Promise<void>;
  createUserHandler: (userData: CreateUserData) => Promise<void>;
  updateUserHandler: (userId: number, userData: UpdateUserData) => Promise<void>;
  updateRoleHandler: (userId: number, roleId: number) => Promise<void>;
  deleteUserHandler: (userId: number) => Promise<void>;
}

export const useAdminUsers = (): UseAdminUsersState => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.mensaje || "Error al cargar usuarios";
      setError(errorMessage);
      console.error("Error al cargar usuarios:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUserHandler = useCallback(async (userData: CreateUserData): Promise<void> => {
    setError(null);
    try {
      await createUser(userData);
      await loadUsers(); // Recargar lista
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Error al crear usuario";
      setError(errorMessage);
      throw err;
    }
  }, [loadUsers]);

  const updateUserHandler = useCallback(async (userId: number, userData: UpdateUserData): Promise<void> => {
    setError(null);
    try {
      await updateUser(userId, userData);
      await loadUsers(); // Recargar lista
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Error al actualizar usuario";
      setError(errorMessage);
      throw err;
    }
  }, [loadUsers]);

  const updateRoleHandler = useCallback(async (userId: number, roleId: number): Promise<void> => {
    setError(null);
    try {
      await updateUserRole(userId, roleId);
      await loadUsers(); // Recargar lista
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Error al actualizar rol";
      setError(errorMessage);
      throw err;
    }
  }, [loadUsers]);

  const deleteUserHandler = useCallback(async (userId: number): Promise<void> => {
    setError(null);
    try {
      await deleteUser(userId);
      await loadUsers(); // Recargar lista
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.mensaje || "Error al eliminar usuario";
      setError(errorMessage);
      throw err;
    }
  }, [loadUsers]);

  return {
    users,
    loading,
    error,
    loadUsers,
    createUserHandler,
    updateUserHandler,
    updateRoleHandler,
    deleteUserHandler,
  };
};


