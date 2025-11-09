import React, { useState } from 'react';
import './AddFoodModal.css';

const AddFoodModal = ({ onClose, onAddFood }) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [mealTime, setMealTime] = useState('Sarapan');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFood = {
      name: foodName,
      calories,
      protein,
      mealTime,
    };
    onAddFood(newFood);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Tambah Makanan Manual</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="foodName">Nama Makanan</label>
            <input
              type="text"
              id="foodName"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="calories">Jumlah Kalori (kkal)</label>
            <input
              type="number"
              id="calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="protein">Jumlah Protein (g)</label>
            <input
              type="number"
              id="protein"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mealTime">Waktu Makan</label>
            <select id="mealTime" value={mealTime} onChange={(e) => setMealTime(e.target.value)}>
              <option>Sarapan</option>
              <option>Makan Siang</option>
              <option>Makan Malam</option>
              <option>Camilan</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-submit">Tambah</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFoodModal;
