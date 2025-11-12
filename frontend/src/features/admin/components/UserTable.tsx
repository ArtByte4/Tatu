import { useState, useMemo } from "react";
import { AdminUser } from "../api/adminApi";
import "../styles/UserTable.css";

interface UserTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onDelete: (userId: number) => void;
  onRoleChange: (userId: number, roleId: number) => void;
  loading?: boolean;
}

type SortField = "user_id" | "user_handle" | "first_name" | "email_address" | "role_id" | "created_at";
type SortDirection = "asc" | "desc";

const getRoleName = (roleId: number): string => {
  switch (roleId) {
    case 1:
      return "Usuario";
    case 2:
      return "Tatuador";
    case 3:
      return "Administrador";
    default:
      return "Desconocido";
  }
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
};

export const UserTable = ({ users, onEdit, onDelete, onRoleChange, loading }: UserTableProps) => {
  const [sortField, setSortField] = useState<SortField>("user_id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar y ordenar usuarios
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(
      (user) =>
        user.user_handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email_address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === "created_at" && aValue && bValue) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, sortField, sortDirection]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="user-table-loading">Cargando usuarios...</div>;
  }

  return (
    <div className="user-table-container">
      <div className="user-table-header">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="user-table-search"
        />
        <div className="user-table-info">
          Mostrando {paginatedUsers.length} de {filteredAndSortedUsers.length} usuarios
        </div>
      </div>

      <div className="user-table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("user_id")} className="sortable">
                ID {sortField === "user_id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("user_handle")} className="sortable">
                Username {sortField === "user_handle" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("first_name")} className="sortable">
                Nombre {sortField === "first_name" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("email_address")} className="sortable">
                Email {sortField === "email_address" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("role_id")} className="sortable">
                Rol {sortField === "role_id" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("created_at")} className="sortable">
                Fecha Registro {sortField === "created_at" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-data">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.user_handle}</td>
                  <td>{`${user.first_name} ${user.last_name}`}</td>
                  <td>{user.email_address}</td>
                  <td>
                    <select
                      value={user.role_id}
                      onChange={(e) => onRoleChange(user.user_id, Number(e.target.value))}
                      className="role-select"
                    >
                      <option value={1}>Usuario</option>
                      <option value={2}>Tatuador</option>
                      <option value={3}>Administrador</option>
                    </select>
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => onEdit(user)} className="btn-edit">
                        Editar
                      </button>
                      <button onClick={() => onDelete(user.user_id)} className="btn-delete">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="user-table-pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Anterior
          </button>
          <span className="pagination-info">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};


