import React, { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import './PwaUpdater.css';

function PwaUpdater() {
  const [installPrompt, setInstallPrompt] = useState(null);

  // Tangani event instalasi PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    const result = await installPrompt.prompt();
    console.log('Installation prompt result:', result);
    setInstallPrompt(null); // Prompt hanya bisa digunakan sekali
  };

  // Logika untuk notifikasi pembaruan
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker terdaftar:', r);
    },
    onRegisterError(error) {
      console.log('Error pendaftaran Service Worker:', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className="pwa-toast-container">
      { (offlineReady || needRefresh) &&
        <div className="pwa-toast">
          <div className="message">
            { offlineReady ? <span>Aplikasi siap bekerja offline</span> : <span>Versi baru tersedia, muat ulang?</span> }
          </div>
          { needRefresh && <button className="pwa-button" onClick={() => updateServiceWorker(true)}>Muat Ulang</button> }
          <button className="pwa-button" onClick={() => close()}>Tutup</button>
        </div>
      }
      { installPrompt &&
        <div className="pwa-toast install-toast">
            <div className="message">
                <span>Install aplikasi ini di perangkat Anda?</span>
            </div>
            <button className="pwa-button" onClick={handleInstallClick}>Install</button>
        </div>
      }
    </div>
  );
}

export default PwaUpdater;
