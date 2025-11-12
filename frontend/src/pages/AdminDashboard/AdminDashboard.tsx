import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { Nav } from "@/features/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useAdminUsers, UserTable, UserModal, DeleteConfirmModal, type AdminUser, type CreateUserData, type UpdateUserData } from "@/features/admin";
import { exportUsersToExcel } from "@/features/admin/utils/exportToExcel";

function AdminDashboard() {
  const { user } = useAuthStore();
  const {
    users,
    loading,
    error,
    loadUsers,
    createUserHandler,
    updateUserHandler,
    updateRoleHandler,
    deleteUserHandler,
  } = useAdminUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: number) => {
    const userToDelete = users.find((u) => u.user_id === userId);
    if (userToDelete) {
      setSelectedUser(userToDelete);
      setIsDeleteModalOpen(true);
    }
  };

  const handleSaveUser = async (userData: CreateUserData | UpdateUserData) => {
    if (modalMode === "create") {
      await createUserHandler(userData as CreateUserData);
    } else if (selectedUser) {
      await updateUserHandler(selectedUser.user_id, userData as UpdateUserData);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      setDeleteLoading(true);
      try {
        await deleteUserHandler(selectedUser.user_id);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleRoleChange = async (userId: number, roleId: number) => {
    try {
      await updateRoleHandler(userId, roleId);
    } catch (error) {
      console.error("Error al actualizar rol:", error);
    }
  };

  const handleExportToExcel = () => {
    if (users.length === 0) {
      alert("No hay usuarios para exportar");
      return;
    }
    try {
      exportUsersToExcel(users);
    } catch (error) {
      console.error("Error al exportar usuarios:", error);
      alert("Error al exportar usuarios a Excel");
    }
  };

  return (
    <>
      <div className="container_explore_page">
        <div className="sidebar">
          <Nav optionsAdmin={Number(user?.rol) === 3} />
        </div>
        <div className="main-content admin-dashboard">
          <div className="admin-dashboard-header">
            <h1>Panel de Administración</h1>
            <div className="admin-dashboard-actions">
              <button onClick={handleExportToExcel} className="btn-export-excel">
                Exportar a Excel
              </button>
              <button onClick={handleCreateUser} className="btn-create-user">
                + Crear Usuario
              </button>
            </div>
          </div>

          {error && <div className="admin-error-message">{error}</div>}

          <UserTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onRoleChange={handleRoleChange}
            loading={loading}
          />

          <UserModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedUser(null);
            }}
            onSave={handleSaveUser}
            user={selectedUser}
            mode={modalMode}
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedUser(null);
            }}
            onConfirm={handleConfirmDelete}
            userName={selectedUser?.user_handle || ""}
            loading={deleteLoading}
          />
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
