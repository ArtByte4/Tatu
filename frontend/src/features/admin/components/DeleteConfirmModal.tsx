import "../styles/DeleteConfirmModal.css";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName: string;
  loading?: boolean;
}

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, userName, loading }: DeleteConfirmModalProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // El error se maneja en el componente padre
      console.error("Error al eliminar usuario:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <h2>Confirmar Eliminación</h2>
        </div>

        <div className="delete-modal-body">
          <p>
            ¿Estás seguro de que deseas eliminar al usuario <strong>{userName}</strong>?
          </p>
          <p className="delete-warning">Esta acción no se puede deshacer.</p>
        </div>

        <div className="delete-modal-actions">
          <button type="button" onClick={onClose} className="btn-cancel" disabled={loading}>
            Cancelar
          </button>
          <button type="button" onClick={handleConfirm} className="btn-delete-confirm" disabled={loading}>
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
};


