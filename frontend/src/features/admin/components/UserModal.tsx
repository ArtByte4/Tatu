import { useState, useEffect } from "react";
import { AdminUser, CreateUserData, UpdateUserData } from "../api/adminApi";
import "../styles/UserModal.css";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: CreateUserData | UpdateUserData) => Promise<void>;
  user?: AdminUser | null;
  mode: "create" | "edit";
}

export const UserModal = ({ isOpen, onClose, onSave, user, mode }: UserModalProps) => {
  const [formData, setFormData] = useState<CreateUserData>({
    user_handle: "",
    email_address: "",
    first_name: "",
    last_name: "",
    phonenumber: "",
    password_hash: "",
    birth_day: "",
    role_id: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && user) {
        setFormData({
          user_handle: user.user_handle || "",
          email_address: user.email_address || "",
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          phonenumber: user.phonenumber || "",
          password_hash: "", // No prellenar contraseña
          birth_day: user.birth_day || "",
          role_id: user.role_id || 1,
        });
      } else {
        setFormData({
          user_handle: "",
          email_address: "",
          first_name: "",
          last_name: "",
          phonenumber: "",
          password_hash: "",
          birth_day: "",
          role_id: 1,
        });
      }
      setError(null);
    }
  }, [isOpen, mode, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "role_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "create") {
        // Validar campos requeridos para crear
        if (!formData.password_hash || formData.password_hash.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres");
          setLoading(false);
          return;
        }
        await onSave(formData);
      } else {
        // Para editar, no incluir password si está vacío
        const updateData: UpdateUserData = {
          user_handle: formData.user_handle,
          email_address: formData.email_address,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phonenumber: formData.phonenumber,
          birth_day: formData.birth_day,
          role_id: formData.role_id,
        };
        // Solo incluir password si se proporcionó uno nuevo
        if (formData.password_hash && formData.password_hash.length >= 6) {
          updateData.password_hash = formData.password_hash;
        }
        await onSave(updateData);
      }
      onClose();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.mensaje ||
        "Error al guardar usuario";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal-header">
          <h2>{mode === "create" ? "Crear Usuario" : "Editar Usuario"}</h2>
          <button className="user-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-modal-form">
          {error && <div className="user-modal-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="user_handle">Username *</label>
            <input
              type="text"
              id="user_handle"
              name="user_handle"
              value={formData.user_handle}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email_address">Email *</label>
            <input
              type="email"
              id="email_address"
              name="email_address"
              value={formData.email_address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">Nombre *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Apellido *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phonenumber">Teléfono *</label>
            <input
              type="tel"
              id="phonenumber"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birth_day">Fecha de Nacimiento *</label>
              <input
                type="date"
                id="birth_day"
                name="birth_day"
                value={formData.birth_day}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role_id">Rol *</label>
              <select id="role_id" name="role_id" value={formData.role_id} onChange={handleChange} required>
                <option value={1}>Usuario</option>
                <option value={2}>Tatuador</option>
                <option value={3}>Administrador</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password_hash">
              Contraseña {mode === "create" ? "*" : "(dejar vacío para no cambiar)"}
            </label>
            <input
              type="password"
              id="password_hash"
              name="password_hash"
              value={formData.password_hash}
              onChange={handleChange}
              required={mode === "create"}
              minLength={6}
            />
          </div>

          <div className="user-modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Guardando..." : mode === "create" ? "Crear" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

