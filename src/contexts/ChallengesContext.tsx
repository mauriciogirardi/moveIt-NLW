/* eslint-disable no-new */
/* eslint-disable no-restricted-properties */
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenge.json';
import { CountdownProvider } from './CountdownContext';
import LevelUpModal from '../components/LevelUpModal';

interface ChallengeProviderProps {
  children: ReactNode;
  level: number;
  currentExperience: number;
  challengeCompleted: number;
}

interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengesContextData {
  level: number;
  currentExperience: number;
  challengeCompleted: number;
  activeChallenge: Challenge;
  experienceToNextLevel: number;
  levelUp: () => void;
  resetChallenge: () => void;
  startNewChallenge: () => void;
  completeChallenge: () => void;
  closeLevelUpModal: () => void;
}

export const ChallengeContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({
  children,
  ...rest
}: ChallengeProviderProps) {
  const [level, setLevel] = useState(rest.level ?? 1);
  const [currentExperience, setCurrentExperience] = useState(
    rest.currentExperience ?? 0,
  );
  const [challengeCompleted, setChallengeCompleted] = useState(
    rest.challengeCompleted ?? 0,
  );

  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    Cookies.set('level', String(level));
    Cookies.set('currentExperience', String(currentExperience));
    Cookies.set('challengeCompleted', String(challengeCompleted));
  }, [level, currentExperience, challengeCompleted]);

  const levelUp = useCallback(() => {
    setLevel(prevState => prevState + 1);
    setIsLevelUpModalOpen(true);
  }, []);

  const closeLevelUpModal = useCallback(() => {
    setIsLevelUpModalOpen(false);
  }, []);

  const startNewChallenge = useCallback(() => {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge);

    new Audio('/notification.mp3').play();

    if (Notification.permission === 'granted') {
      new Notification('Novo desafio', {
        body: `Valendo ${challenge.amount}xp!`,
      });
    }
  }, []);

  const resetChallenge = useCallback(() => {
    setActiveChallenge(null);
  }, []);

  const completeChallenge = useCallback(() => {
    if (!activeChallenge) return;

    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if (finalExperience >= experienceToNextLevel) {
      finalExperience -= experienceToNextLevel;
      levelUp();
    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengeCompleted(prevState => prevState + 1);
  }, [activeChallenge, currentExperience, experienceToNextLevel, levelUp]);

  return (
    <ChallengeContext.Provider
      value={{
        level,
        currentExperience,
        challengeCompleted,
        activeChallenge,
        experienceToNextLevel,
        levelUp,
        startNewChallenge,
        resetChallenge,
        completeChallenge,
        closeLevelUpModal,
      }}
    >
      <CountdownProvider>
        {children}

        {isLevelUpModalOpen && <LevelUpModal />}
      </CountdownProvider>
    </ChallengeContext.Provider>
  );
}
