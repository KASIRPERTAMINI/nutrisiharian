import React from 'react';
import './AnalysisResult.css';

const AnalysisResult = ({ analysisData, imagePreview, onConfirm, onCancel }) => {
  const { detectedItems, total } = analysisData;

  const handleConfirm = () => {
    const newFoodItems = detectedItems.map(item => ({
        name: item.name,
        calories: item.calories,
        protein: item.protein,
        mealTime: 'Camilan' // Default, bisa diubah nanti
    }));
    onConfirm(newFoodItems);
  };

  return (
    <div className="analysis-container">
      <h2>Hasil Analisis AI</h2>
      <div className="result-content">
        <div className="result-image">
          <img src={imagePreview} alt="Makanan yang dianalisis" />
        </div>
        <div className="result-details">
          <h3>Kami mendeteksi:</h3>
          <ul>
            {detectedItems.map((item, index) => (
              <li key={index}>
                {item.name} ({item.calories} kkal, {item.protein}g protein)
              </li>
            ))}
          </ul>
          <div className="result-total">
            <h3>Estimasi Total</h3>
            <p><strong>{total.calories}</strong> kkal</p>
            <p><strong>{total.protein}</strong> g protein</p>
          </div>
        </div>
      </div>
      <div className="result-actions">
        <button className="btn-cancel" onClick={onCancel}>Batal</button>
        <button className="btn-submit" onClick={handleConfirm}>Tambahkan ke Log Harian</button>
      </div>
    </div>
  );
};

export default AnalysisResult;
