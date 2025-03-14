import { ReactNode } from 'react';
import styles from './LeftPanel.module.css';

interface LeftPanelProps {
    children?: ReactNode;
    onWorkspaceClick?: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ children, onWorkspaceClick }) => {
    return (
        <div className={styles.leftPanel}>
            <h2 className={styles.title}>メニュー</h2>
            <nav className={styles.nav}>
                <ul>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); }}>ダッシュボード</a></li>
                    <li>
                        <a 
                            href="#" 
                            onClick={(e) => { 
                                e.preventDefault(); 
                                if (onWorkspaceClick) onWorkspaceClick(); 
                            }}
                        >
                            ワークスペース
                        </a>
                    </li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); }}>アプリケーション</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); }}>設定</a></li>
                </ul>
            </nav>
            {children}
        </div>
    );
};

export default LeftPanel;
