import React from "react";
import styles from "./DeleteConfirmation.module.css";

/**
 * Props interface for the DeleteConfirmation component.
 * @interface DeleteConfirmationProps
 * @property {Function} onConfirm - Callback function to execute when deletion is confirmed
 * @property {Function} onCancel - Callback function to execute when deletion is cancelled
 * @property {string} beanType - Type of coffee beans for the brew being deleted
 */
interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  beanType: string;
}

/**
 * Modal dialog component for confirming brew deletion.
 * Displays a confirmation message with the brew's bean type and
 * provides options to confirm or cancel the deletion.
 *
 * @component
 * @example
 * ```tsx
 * <DeleteConfirmation
 *   beanType="Ethiopian Yirgacheffe"
 *   onConfirm={() => handleDelete(id)}
 *   onCancel={() => setShowConfirmation(false)}
 * />
 * ```
 */
const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  onConfirm,
  onCancel,
  beanType,
}) => {
  return (
    <div
      className={styles.overlay}
      onClick={onCancel}
      data-testid="delete-overlay"
    >
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        data-testid="delete-dialog"
      >
        <h3 className={styles.title}>Delete Brew</h3>
        <p className={styles.message}>
          Are you sure you want to delete your {beanType} brew? This action
          cannot be undone.
        </p>
        <div className={styles.buttons}>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            data-testid="cancel-button"
          >
            Cancel
          </button>
          <button
            className={styles.deleteButton}
            onClick={onConfirm}
            data-testid="confirm-delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
