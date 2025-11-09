import React from 'react';
import './FoodLog.css';

const FoodLog = ({ foodItems }) => {
  return (
    <section className="food-log-section">
      <h2>Log Harian</h2>
      <div className="log-list">
        {foodItems.length > 0 ? (
          foodItems.map((item, index) => (
            <div
              key={item.id || index}
              className={`food-card ${item.isNew ? 'new-item' : ''}`}
            >
              <div className="food-info">
                <h3>{item.name}</h3>
                <p>{item.mealTime}</p>
              </div>
              <div className="food-nutrition">
                <p><strong>{item.calories}</strong> kkal</p>
                <p><strong>{item.protein}</strong> g protein</p>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-log-message">Belum ada makanan yang ditambahkan hari ini.</p>
        )}
      </div>
    </section>
  );
};

export default FoodLog;
