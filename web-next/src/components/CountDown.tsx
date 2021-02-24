import { useState, useEffect, useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/CountDown.module.css';

let countDownTimeOut: NodeJS.Timeout; 

export function CountDown() {
  const { startNewChallenge } = useContext(ChallengesContext)

  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const [minuteLeft, minuteRigth] = String(minutes).padStart(2, '0').split('');
  const [secondLeft, secondRigth] = String(seconds).padStart(2, '0').split('');

  function startCountDown() {
    setIsActive(true);
  }

  function resetCountDown() {
    clearTimeout(countDownTimeOut);
    setIsActive(false);
    setTime(25 * 60);
  }

  useEffect(() => {
    if(isActive && time > 0) {
      countDownTimeOut = setTimeout(() => {
        setTime(time -1);
      }, 1000)
    } else if (isActive && time === 0) {
      setHasFinished(true);
      setIsActive(false);
      startNewChallenge();
    }
  }, [isActive, time])

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