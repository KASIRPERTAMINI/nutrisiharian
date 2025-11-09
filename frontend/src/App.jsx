import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Summary from './components/Summary';
import FoodLog from './components/FoodLog';
import AddButton from './components/AddButton';
import AddFoodModal from './components/AddFoodModal';
import AddOptionsModal from './components/AddOptionsModal';
import ImageUploadModal from './components/ImageUploadModal';
import AnalysisResult from './components/AnalysisResult';
import SettingsPage from './components/SettingsPage';

function App() {
  const [foodLog, setFoodLog] = useState([]);
  const [targets, setTargets] = useState({ calorieTarget: 0, proteinTarget: 0 });
  const [currentTotals, setCurrentTotals] = useState({ calories: 0, protein: 0 });

  const [activeModal, setActiveModal] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const fetchData = () => {
    fetch('/api/log/today').then(res => res.json()).then(data => setFoodLog(data.map(item => ({...item, isNew: false}))));
    fetch('/api/targets').then(res => res.json()).then(setTargets);
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    const totals = foodLog.reduce((acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
    }), { calories: 0, protein: 0 });
    setCurrentTotals(totals);
  }, [foodLog]);

  const addFoodItemsToLog = (items) => {
    const newItemsWithFlag = items.map(item => ({ ...item, isNew: true }));
    setFoodLog(prev => [...prev, ...newItemsWithFlag]);
    setTimeout(() => setFoodLog(prev => prev.map(item => ({ ...item, isNew: false }))), 1000);
  };

  const handleAddFood = (newFood) => {
    fetch('/api/food/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFood),
    }).then(res => res.json()).then(addedFood => {
      addFoodItemsToLog([addedFood]);
      setActiveModal(null);
    });
  };

  const handleConfirmAnalysis = (newItems) => {
    // Di aplikasi nyata, ini idealnya akan menjadi satu transaksi batch ke backend
    newItems.forEach(item => {
      fetch('/api/food/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      }).then(res => res.json()).then(addedFood => {
        setFoodLog(prev => [...prev.filter(i => i.id !== addedFood.id), addedFood]);
      });
    });
    setAnalysisData(null);
    setTimeout(fetchData, 500); // Refresh data
  };

  const handleResetData = () => {
    fetch('/api/reset', { method: 'DELETE' })
      .then(res => res.json())
      .then(() => {
        fetchData(); // Ambil ulang data yang sudah direset (log kosong, target default)
        setShowSettings(false); // Kembali ke dasbor
      });
  };

  const renderContent = () => {
    if (showSettings) return <SettingsPage onBack={() => setShowSettings(false)} currentTargets={targets} onSave={setTargets} onReset={handleResetData} />;
    if (analysisData) return <AnalysisResult analysisData={analysisData} imagePreview={imagePreview} onConfirm={handleConfirmAnalysis} onCancel={() => setAnalysisData(null)} />;
    return <><Summary currentTotals={currentTotals} targets={targets} /><FoodLog foodItems={foodLog} /></>;
  };

  return (
    <div className="app-container">
      <Header userName="Pengguna" onSettingsClick={() => setShowSettings(true)} />
      <main>{renderContent()}</main>

      {!analysisData && !showSettings && <AddButton onClick={() => setActiveModal('options')} />}

      {activeModal === 'options' && <AddOptionsModal onClose={() => setActiveModal(null)} onSelectOption={setActiveModal} />}
      {activeModal === 'manual' && <AddFoodModal onClose={() => setActiveModal(null)} onAddFood={handleAddFood} />}
      {activeModal === 'upload' && <ImageUploadModal onClose={() => setActiveModal(null)} onAnalysisComplete={(data, preview) => { setAnalysisData(data); setImagePreview(preview); setActiveModal(null); }} />}
    </div>
  );
}

export default App;
