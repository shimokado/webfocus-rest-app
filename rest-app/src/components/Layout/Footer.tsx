import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>WebFOCUS RESTful ポータルアプリケーション</p>
      <p>© {new Date().getFullYear()} WebFOCUS ユーザー</p>
    </footer>
  );
};

export default Footer;
