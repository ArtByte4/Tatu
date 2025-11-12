import * as XLSX from "xlsx";
import type { AdminUser } from "../api/adminApi";

/**
 * Exporta un array de usuarios a un archivo Excel
 * @param users Array de usuarios a exportar
 */
export const exportUsersToExcel = (users: AdminUser[]): void => {
  // Mapear los datos de usuarios a formato de hoja de cálculo
  const worksheetData = users.map((user) => {
    // Mapear role_id a nombre de rol
    const roleNames: Record<number, string> = {
      1: "Usuario",
      2: "Tatuador",
      3: "Administrador",
    };

    return {
      ID: user.user_id,
      "User Handle": user.user_handle,
      Nombre: user.first_name,
      Apellido: user.last_name,
      Email: user.email_address,
      Teléfono: user.phonenumber,
      "Fecha de Nacimiento": user.birth_day,
      Rol: roleNames[user.role_id] || `Rol ${user.role_id}`,
      "Fecha de Creación": user.created_at || "",
      Género: user.gender || "",
      Bio: user.bio || "",
      Seguidores: user.follower_count || 0,
    };
  });

  // Crear un libro de trabajo y una hoja
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

  // Generar nombre de archivo con fecha actual
  const today = new Date();
  const dateString = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const fileName = `usuarios_${dateString}.xlsx`;

  // Escribir el archivo y descargarlo
  XLSX.writeFile(workbook, fileName);
};

