import { FolderItem } from '../../services/WebFocusService';
import styles from './FolderCard.module.css';

interface FolderCardProps {
  item: FolderItem;
  onClick?: (item: FolderItem) => void;
}

const FolderCard: React.FC<FolderCardProps> = ({ item, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.cardHeader}>
        <img 
          src={item.thumbPath || '/folder-icon.svg'} 
          alt={item.typeDescription} 
          className={styles.icon} 
        />
        <h3 className={styles.title}>{item.name}</h3>
      </div>
      
      <div className={styles.cardBody}>
        <p className={styles.description}>{item.description || item.name}</p>
        <div className={styles.details}>
          <span className={styles.detail}>
            <strong>タイプ:</strong> {item.typeDescription}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FolderCard;
