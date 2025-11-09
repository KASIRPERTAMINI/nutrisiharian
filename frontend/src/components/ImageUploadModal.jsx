import React, { useState, useRef, useEffect } from 'react';
import './ImageUploadModal.css';

const getApiUrl = (path) => `${import.meta.env.VITE_API_URL}${path}`;

const ImageUploadModal = ({ onClose, onAnalysisComplete, mode }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const fileInputRef = useRef(null);

  const isCameraMode = mode === 'camera';

  useEffect(() => {
    // Secara otomatis memicu input file saat komponen dimuat
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    } else if (file) {
      setError('Silakan pilih file gambar yang valid.');
    }
    // Jika tidak ada file yang dipilih (misalnya pengguna membatalkan), tutup modal
    if (!file) {
      onClose();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('foodImage', selectedFile);
    formData.append('description', foodDescription);

    try {
      const response = await fetch(getApiUrl('/api/food/analyze'), {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`Error ${response.status}: ${await response.text()}`);
      const result = await response.json();
      onAnalysisComplete(result, preview);
    } catch (err) {
      setError(err.message || 'Gagal menganalisis gambar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content upload-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isCameraMode ? 'Ambil Foto Makanan' : 'Unggah dari Galeri'}</h2>

        {isLoading ? (
          <div className="loading-container"><div className="spinner"></div><p>Menganalisis...</p></div>
        ) : (
          <>
            {preview && (
              <div className="image-preview"><img src={preview} alt="Pratinjau Makanan" /></div>
            )}

            <input
              ref={fileInputRef}
              id="food-image-input"
              type="file"
              accept="image/*"
              capture={isCameraMode ? 'environment' : undefined}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {!selectedFile && <p>Menunggu gambar...</p>}

            {selectedFile && (
              <>
                <div className="form-group">
                  <label htmlFor="foodDescription">Keterangan Tambahan (Opsional)</label>
                  <input
                    type="text"
                    id="foodDescription"
                    placeholder="Contoh: Dada ayam, tanpa kulit"
                    value={foodDescription}
                    onChange={(e) => setFoodDescription(e.target.value)}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => fileInputRef.current.click()}>Ambil Ulang</button>
                  <button type="button" className="btn-submit" onClick={handleUpload}>Analisis</button>
                </div>
              </>
            )}

            {error && <p className="error-message">{error}</p>}

            <button className="btn-close-absolute" onClick={onClose}>×</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploadModal;
