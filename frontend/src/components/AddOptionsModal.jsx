import React from 'react';
import './AddOptionsModal.css';

const AddOptionsModal = ({ onClose, onSelectOption }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content options-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Tambah Makanan</h2>
        <p>Pilih salah satu cara untuk menambahkan makanan Anda.</p>
        <div className="options-buttons">
          <button className="option-btn" onClick={() => onSelectOption('upload')}>
            <span className="icon">📷</span>
            <h3>Unggah Foto</h3>
            <p>Analisis nutrisi dari gambar</p>
          </button>
          <button className="option-btn" onClick={() => onSelectOption('manual')}>
            <span className="icon">✏️</span>
            <h3>Input Manual</h3>
            <p>Masukkan data kalori & protein</p>
          </button>
        </div>
        <button className="btn-cancel" onClick={onClose}>Batal</button>
      </div>
    </div>
  );
};

export default AddOptionsModal;
