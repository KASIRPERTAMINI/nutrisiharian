import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ userName, onSettingsClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <header className="app-header">
      <div className="greeting">
        <h1>Selamat Datang, {userName}</h1>
        <p>Semoga harimu menyenangkan!</p>
      </div>
      <div className="header-right">
        <div className="date-time">
          <p className="time">{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="date">{formatDate(currentTime)}</p>
        </div>
        <button onClick={onSettingsClick} className="settings-btn" title="Pengaturan">⚙️</button>
      </div>
    </header>
  );
};

export default Header;
