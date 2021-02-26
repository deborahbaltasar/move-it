import { useState, useEffect, useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import { CountDownContext } from '../contexts/CountDownContext';
import styles from '../styles/components/CountDown.module.css';

export function CountDown() {
  const { 
    minutes, 
    seconds, 
    hasFinished, 
    isActive, 
    resetCountDown, 
    startCountDown
  } = useContext(CountDownContext);

  const [minuteLeft, minuteRigth] = String(minutes).padStart(2, '0').split('');
  const [secondLeft, secondRigth] = String(seconds).padStart(2, '0').split('');

  return (
    <div>
      <div className={styles.conuntDownContainer}>
        <div>
          <span>{minuteLeft}</span>
          <span>{minuteRigth}</span>
        </div>
        <span>:</span>
        <div>
          <span>{secondLeft}</span>
          <span>{secondRigth}</span>
        </div>
      </div>

      {hasFinished ? (
        <button 
          disabled
          className={styles.countDownButton}
        >
          Ciclo Encerrado!
        </button>
      ) : (
        isActive ? (
          <button 
            type="button" 
            className={`${styles.countDownButton} ${styles.countDownButtonActive}`}
            onClick={resetCountDown}
          >
            Abandonar ciclo
          </button>
        ) : (
          <button 
            type="button" 
            className={styles.countDownButton}
            onClick={startCountDown}
          >
            Iniciar um ciclo
          </button>
        )
      ) }


    </div>
  );
}