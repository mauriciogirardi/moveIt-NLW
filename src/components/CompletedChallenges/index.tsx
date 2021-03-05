import { useContext } from 'react';
import { ChallengeContext } from '../../contexts/ChallengesContext';
import styles from './styles.module.css';

export default function CompletedChallenges() {
  const { challengeCompleted } = useContext(ChallengeContext);

  return (
    <div className={styles.completedChallenges}>
      <span>Desafios completos</span>
      <span>{challengeCompleted}</span>
    </div>
  );
}
