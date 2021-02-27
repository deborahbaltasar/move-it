import { createContext, ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;

}

interface ChallengesContextData {
  level: number;
  currentExperience: number;
  experienceToNextLevel: number;
  challengesCompleted: number; 
  activeChallenge: Challenge;
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completedChallenge: () => void;
  closeModal: () => void;
}

interface ChallengesProps {
  children: ReactNode;
  level: number; 
  currentExperience: number;  
  challengesCompleted: number; 
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children,...rest } : ChallengesProps) {
  const [level, setLevel] = useState(rest.level ?? 1);
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
  const [challengesCompleted, setChallengesCompleted] = useState (rest.challengesCompleted ?? 0);

  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const experienceToNextLevel = Math.pow((level + 1) * 4,2)

  useEffect(() => {
    Notification.requestPermission();
  }, [])

  useEffect(() => {
    Cookies.set('level', String(level));
    Cookies.set('currentExperience', String(currentExperience));
    Cookies.set('challengesCompleted', String(challengesCompleted));
  }, [level, currentExperience, challengesCompleted])

  function levelUp() {
    setLevel(level+1);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function startNewChallenge() {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengeIndex];
    
    setActiveChallenge(challenge); 

    new Audio('/notification.mp3').play();

    if(Notification.permission === 'granted') {
      new Notification('Novo Desafio', {
        body: `Valendo ${challenge.amount} xp!`
      })
    }
  }

  function resetChallenge() {
    setActiveChallenge(null);
  }

  function completedChallenge() {
    if(!activeChallenge) {
      return;
    }
    
    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if(finalExperience > experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel;
      levelUp();
    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengesCompleted(challengesCompleted + 1);
  }

  return (
    <ChallengesContext.Provider 
      value={{
        level, 
        currentExperience, 
        experienceToNextLevel,
        challengesCompleted, 
        activeChallenge,
        levelUp,
        startNewChallenge,
        resetChallenge,
        completedChallenge,
        closeModal,
      }}
    >
      {children}
     { isModalOpen && <LevelUpModal /> }
    </ChallengesContext.Provider>
  );
}