import React from 'react';
import styles from './DeleteConfirmation.module.css';

interface DeleteConfirmationProps {
    onConfirm: () => void;
    onCancel: () => void;
    beanType: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
    onConfirm,
    onCancel,
    beanType
}) => {
    return (
        <div className={styles.overlay} onClick={onCancel} data-testid="delete-overlay">
            <div className={styles.dialog} onClick={e => e.stopPropagation()} data-testid="delete-dialog">
                <h3 className={styles.title}>Delete Brew</h3>
                <p className={styles.message}>
                    Are you sure you want to delete your {beanType} brew? This action cannot be undone.
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