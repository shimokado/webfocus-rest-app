import { ReactNode } from 'react';
import { FolderItem } from '../../services/WebFocusService';
import FolderCardGrid from '../Card/FolderCardGrid';
import styles from './RightPanel.module.css';

interface RightPanelProps {
  currentPath: string;
  items: FolderItem[];
  isLoading: boolean;
  errorMessage: string | null;
  onItemClick: (item: FolderItem) => void;
  onPathClick: (path: string) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  currentPath,
  items,
  isLoading,
  errorMessage,
  onItemClick,
  onPathClick
}) => {
  // パス階層を解析してリンク可能な部分を特定する
  const renderPathParts = (path: string) => {
    if (!path) return null;

    // パスを'/'で分割
    const parts = path.split('/');
    
    // 各パーツをリンクまたはテキストとして表示
    return parts.map((part, index) => {
      // 'IBFS:', 'WFC'は非リンク
      if (index <= 1) {
        return <span key={index}>{part}{index < parts.length - 1 ? '/' : ''}</span>;
      }
      
      // 最後のパーツは非リンク
      if (index === parts.length - 1) {
        return <span key={index}>{part}</span>;
      }

      // 中間のパーツ（Repositoryを含む）はクリック可能なリンクとして表示
      const currentPartPath = parts.slice(0, index + 1).join('/');
      return (
        <span key={index}>
          <button
            className={styles.pathLink}
            onClick={() => onPathClick(currentPartPath)}
          >
            {part}
          </button>
          /
        </span>
      );
    });
  };

  return (
    <div className={styles.rightPanel}>
      {currentPath && (
        <div className={styles.pathBar}>
          <span className={styles.pathLabel}>現在のパス:</span>
          <div className={styles.pathParts}>
            {renderPathParts(currentPath)}
          </div>
        </div>
      )}
      
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loading}>読み込み中...</div>
        ) : errorMessage ? (
          <div className={styles.error}>{errorMessage}</div>
        ) : (
          <FolderCardGrid items={items} onItemClick={onItemClick} />
        )}
      </div>
    </div>
  );
};

export default RightPanel;
