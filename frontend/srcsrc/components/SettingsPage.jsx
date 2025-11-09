import React, { useState } from 'react';
import './SettingsPage.css';
import ConfirmModal from './ConfirmModal';

const getApiUrl = (path) => `${import.meta.env.VITE_API_URL}${path}`;

const SettingsPage = ({ onBack, currentTargets, onSave, onReset }) => {
  const [calories, setCalories] = useState(currentTargets.calorieTarget);
  const [protein, setProtein] = useState(currentTargets.proteinTarget);
  const [message, setMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(0);

  const handleSave = () => {
    const newTargets = { calorieTarget: calories, proteinTarget: protein };
    fetch(getApiUrl('/api/targets'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTargets),
    })
      .then(res => res.json())
      .then(data => {
        onSave(data.targets);
        setMessage('Target berhasil disimpan!');
        setTimeout(() => setMessage(''), 2000);
      });
  };

  const handleResetClick = () => {
    setShowConfirmModal(1);
  };

  const handleConfirmReset = () => {
    if (showConfirmModal === 1) {
      setShowConfirmModal(2);
    } else if (showConfirmModal === 2) {
      onReset();
      setShowConfirmModal(0);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button onClick={onBack} className="back-btn">← Kembali</button>
        <h2>Pengaturan</h2>
      </div>

      <div className="settings-card">
        <h3>Target Harian</h3>
        <div className="form-group">
          <label htmlFor="calorie-target">Target Kalori (kkal)</label>
          <input id="calorie-target" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="protein-target">Target Protein (g)</label>
          <input id="protein-target" type="number" value={protein} onChange={(e) => setProtein(e.target.value)} />
        </div>
        <button className="btn-save" onClick={handleSave}>Simpan Target</button>
        {message && <p className="save-message">{message}</p>}
      </div>

      <div className="settings-card danger-zone">
        <h3>Zona Berbahaya</h3>
        <p>Tindakan ini tidak dapat diurungkan. Ini akan menghapus semua log makanan Anda secara permanen.</p>
        <button className="btn-danger" onClick={handleResetClick}>Reset Semua Data</button>
      </div>

      {showConfirmModal === 1 && (
        <ConfirmModal
          title="Anda Yakin?"
          message="Apakah Anda benar-benar yakin ingin mereset semua data? Tindakan ini tidak dapat diurungkan."
          onConfirm={handleConfirmReset}
          onCancel={() => setShowConfirmModal(0)}
          confirmText="Ya, Reset"
        />
      )}
      {showConfirmModal === 2 && (
        <ConfirmModal
          title="Konfirmasi Terakhir"
          message="Ini adalah peringatan terakhir. Semua log makanan Anda akan dihapus."
          onConfirm={handleConfirmReset}
          onCancel={() => setShowConfirmModal(0)}
          confirmText="Ya, Saya Mengerti, Hapus Data Saya"
        />
      )}
    </div>
  );
};

export default SettingsPage;
