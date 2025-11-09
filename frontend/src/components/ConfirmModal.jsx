import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm' }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content confirm-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="form-actions">
          <button className="btn-cancel" onClick={onCancel}>Batal</button>
          <button className="btn-confirm-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
