import styles from './Header.module.css';

interface HeaderProps {
  userName: string | null;
  userDisplayName: string | null;
  userFullPath: string | null;
}

const Header: React.FC<HeaderProps> = ({ userName, userDisplayName, userFullPath }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>WebFOCUS WebApp</div>
      <div className={styles.userInfo}>
        <div className={styles.userDetail}>
          <span className={styles.label}>ユーザーID:</span>
          <span className={styles.value}>{userName || '-'}</span>
        </div>
        <div className={styles.userDetail}>
          <span className={styles.label}>名前:</span>
          <span className={styles.value}>{userDisplayName || '-'}</span>
        </div>
        {/* <div className={styles.userDetail}>
          <span className={styles.label}>パス:</span>
          <span className={styles.value}>{userFullPath || '-'}</span>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
