import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ userName, onSettingsClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>Halo, User! 👋</h1>
        <p>Mari lacak nutrisi harian Anda</p>
      </div>
      <div className="header-right">
        <div className="date-time">
          <p className="time">{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="date">{formatDate(currentTime)}</p>
        </div>
        <button onClick={onSettingsClick} className="settings-btn" title="Pengaturan">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
