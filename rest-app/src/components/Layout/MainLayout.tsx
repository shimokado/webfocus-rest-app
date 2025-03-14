import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import LeftPanel from '../Panel/LeftPanel';
import RightPanel from '../Panel/RightPanel';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  userName: string | null;
  userDisplayName: string | null;
  userFullPath: string | null;
  leftPanelContent?: ReactNode;
  rightPanelContent?: ReactNode;
  onWorkspaceClick?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  userName,
  userDisplayName,
  userFullPath,
  leftPanelContent,
  rightPanelContent,
  onWorkspaceClick
}) => {
  return (
    <div className={styles.container}>
      <Header 
        userName={userName} 
        userDisplayName={userDisplayName} 
        userFullPath={userFullPath} 
      />
      
      <div className={styles.content}>
        <LeftPanel onWorkspaceClick={onWorkspaceClick}>
          {leftPanelContent}
        </LeftPanel>
        <RightPanel>
          {rightPanelContent}
        </RightPanel>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
