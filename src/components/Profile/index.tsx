import styles from './styles.module.css';

export default function Profile() {
  return (
    <div className={styles.profileContainer}>
      <img
        src="https://avatars.githubusercontent.com/u/51093343?s=460&u=9f8d3fa58300d2697fb37a0b3b535e7908dfda23&v=4"
        alt="Mauricio"
      />

      <div>
        <strong>Mauricio Girardi</strong>
        <p>
          <img src="icons/level.svg" alt="level" />
          Level 1
        </p>
      </div>
    </div>
  );
}
