import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Summary.css';

const Summary = ({ currentTotals, targets }) => {
  const { calorieTarget, proteinTarget } = targets;
  const { calories: currentCalories, protein: currentProtein } = currentTotals;

  const caloriePercentage = calorieTarget > 0 ? (currentCalories / calorieTarget) * 100 : 0;
  const proteinPercentage = proteinTarget > 0 ? (currentProtein / proteinTarget) * 100 : 0;

  return (
    <section className="summary-section">
      <div className="progress-card">
        <h2 className="card-title">Kalori Harian</h2>
        <div className="progress-circle-container">
          <CircularProgressbar
            value={caloriePercentage}
            text={`${currentCalories} kkal`}
            styles={buildStyles({
              textColor: 'var(--text-primary)',
              pathColor: 'var(--accent-color)',
              trailColor: 'var(--background-secondary)',
              pathTransitionDuration: 0.5,
            })}
          />
        </div>
        <p className="target-text">Target: {calorieTarget} kkal</p>
      </div>
      <div className="progress-card">
        <h2 className="card-title">Protein Harian</h2>
        <div className="progress-circle-container">
          <CircularProgressbar
            value={proteinPercentage}
            text={`${currentProtein} g`}
            styles={buildStyles({
              textColor: 'var(--text-primary)',
              pathColor: 'var(--accent-color)',
              trailColor: 'var(--background-secondary)',
              pathTransitionDuration: 0.5,
            })}
          />
        </div>
        <p className="target-text">Target: {proteinTarget} g</p>
      </div>
    </section>
  );
};

export default Summary;
