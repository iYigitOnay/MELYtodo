import styles from './StoryHistory.module.css';
import Skeleton from './Skeleton'; // Import Skeleton component

// Örnek bir Hikaye objesinin tipini tanımlayalım
export interface Story {
  _id: string;
  topic: string;
  originalStory: string;
  translatedStory?: string;
  createdAt: string;
}

interface StoryHistoryProps {
  history: Story[];
  onSelectStory: (id: string) => void;
  onDeleteStory: (id: string) => void; // Yeni prop
  isHistoryLoading: boolean; // New prop
}

const StoryHistory = ({ history, onSelectStory, onDeleteStory, isHistoryLoading }: StoryHistoryProps) => {
  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Üst öğenin onClick olayını engelle
    onDeleteStory(id);
  };

  return (
    <div className={styles.container}>
      <h2>Son Hikayeler</h2>
      <div className={styles.historyList}>
        {isHistoryLoading ? (
          // Display skeletons when history is loading
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={styles.historyItem}>
              <Skeleton width="60%" height="1.2em" style={{ marginRight: '1rem' }} />
              <Skeleton width="30%" height="1.2em" />
            </div>
          ))
        ) : history.length === 0 ? (
          <p className={styles.placeholder}>Henüz hiç hikaye oluşturmadınız.</p>
        ) : (
          history.map((story) => (
            <div key={story._id} className={styles.historyItem} onClick={() => onSelectStory(story._id)}>
              <span className={styles.topic}>{story.topic}</span>
              <span className={styles.date}>{new Date(story.createdAt).toLocaleDateString('tr-TR')}</span>
              <button
                className={styles.deleteButton}
                onClick={(e) => handleDeleteClick(e, story._id)}
                aria-label="Hikayeyi Sil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StoryHistory;
