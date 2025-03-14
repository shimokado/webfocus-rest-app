import { FolderItem } from '../../services/WebFocusService';
import FolderCard from './FolderCard';
import styles from './FolderCardGrid.module.css';

interface FolderCardGridProps {
  items: FolderItem[];
  onItemClick?: (item: FolderItem) => void;
}

const FolderCardGrid: React.FC<FolderCardGridProps> = ({ items, onItemClick }) => {
  if (!items.length) {
    return <div className={styles.empty}>アイテムはありません</div>;
  }

  return (
    <div className={styles.grid}>
      {items.map((item, index) => (
        <div className={styles.gridItem} key={item.fullPath || index}>
          <FolderCard item={item} onClick={onItemClick} />
        </div>
      ))}
    </div>
  );
};

export default FolderCardGrid;
