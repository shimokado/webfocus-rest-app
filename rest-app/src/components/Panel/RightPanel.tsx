import { ReactNode } from 'react';
import styles from './RightPanel.module.css';

interface RightPanelProps {
  children?: ReactNode;
}

const RightPanel: React.FC<RightPanelProps> = ({ children }) => {
  return (
    <div className={styles.rightPanel}>
      {children || (
        <div className={styles.welcome}>
          <h1>WebFOCUS ポータルへようこそ</h1>
          <p>左側のメニューからアクションを選択してください。</p>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
