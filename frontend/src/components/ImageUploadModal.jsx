import React, { useState } from 'react';
import './ImageUploadModal.css';

const ImageUploadModal = ({ onClose, onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [foodDescription, setFoodDescription] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    } else {
      setSelectedFile(null);
      setPreview(null);
      setError('Silakan pilih file gambar yang valid.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('foodImage', selectedFile);
    formData.append('description', foodDescription); // Tambahkan deskripsi opsional

    try {
      const response = await fetch('/api/food/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal menganalisis gambar.');
      }

      const result = await response.json();
      onAnalysisComplete(result, preview); // Kirim hasil dan pratinjau ke App
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content upload-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Unggah Foto Makanan</h2>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Menganalisis makanan Anda...</p>
          </div>
        ) : (
          <>
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Pratinjau Makanan" />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="food-image-input" className="file-label">
                {selectedFile ? 'Ganti Gambar' : 'Pilih Gambar'}
              </label>
              <input
                id="food-image-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="form-group">
                <label htmlFor="foodDescription">Keterangan Makanan (Opsional)</label>
                <input
                type="text"
                id="foodDescription"
                placeholder="cth: nasi, ayam, sayur"
                value={foodDescription}
                onChange={(e) => setFoodDescription(e.target.value)}
                />
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>Batal</button>
              <button type="button" className="btn-submit" onClick={handleUpload} disabled={!selectedFile}>
                Analisis
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploadModal;
