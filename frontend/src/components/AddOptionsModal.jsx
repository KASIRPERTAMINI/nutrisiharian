import React from 'react';
import './AddOptionsModal.css';

const AddOptionsModal = ({ onClose, onSelectOption }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content options-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Tambah Makanan</h2>
        <p>Pilih salah satu cara untuk menambahkan makanan Anda.</p>
        <div className="options-buttons">
          <button className="option-btn" onClick={() => onSelectOption('camera')}>
            <span className="icon">📸</span>
            <h3>Ambil dari Kamera</h3>
            <p>Gunakan kamera untuk foto baru</p>
          </button>
          <button className="option-btn" onClick={() => onSelectOption('upload')}>
            <span className="icon">🖼️</span>
            <h3>Upload dari Galeri</h3>
            <p>Pilih gambar dari galeri Anda</p>
          </button>
          <button className="option-btn" onClick={() => onSelectOption('manual')}>
            <span className="icon">✏️</span>
            <h3>Input Manual</h3>
            <p>Masukkan data secara manual</p>
          </button>
        </div>
        <button className="btn-cancel" onClick={onClose}>Batal</button>
      </div>
    </div>
  );
};

export default AddOptionsModal;
