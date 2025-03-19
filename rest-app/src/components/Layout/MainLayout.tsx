import { ReactNode } from 'react';
import styles from './MainLayout.module.css';
import Header from './Header';
import Footer from './Footer';
import LeftPanel from '../Panel/LeftPanel';

interface MainLayoutProps {
  userName: string | null;
  userDisplayName: string | null;
  userFullPath: string | null;
  onWorkspaceClick?: () => void;
  rightPanelContent?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  userName,
  userDisplayName,
  userFullPath,
  onWorkspaceClick,
  rightPanelContent
}) => {
  return (
    <div className={styles.container}>
      <Header 
        userName={userName}
        userDisplayName={userDisplayName}
        userFullPath={userFullPath}
      />
      
      <div className={styles.content}>
        <LeftPanel onWorkspaceClick={onWorkspaceClick} />
        {rightPanelContent}
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
