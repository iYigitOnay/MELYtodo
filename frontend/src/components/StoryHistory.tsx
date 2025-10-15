import styles from './StoryHistory.module.css';

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
}

const StoryHistory = ({ history, onSelectStory }: StoryHistoryProps) => {
  return (
    <div className={styles.container}>
      <h2>Son Hikayeler</h2>
      <div className={styles.historyList}>
        {history.length === 0 ? (
          <p className={styles.placeholder}>Henüz hiç hikaye oluşturmadınız.</p>
        ) : (
          history.map((story) => (
            <div key={story._id} className={styles.historyItem} onClick={() => onSelectStory(story._id)}>
              <span className={styles.date}>{new Date(story.createdAt).toLocaleDateString('tr-TR')}</span>
              <span className={styles.topic}>{story.topic}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StoryHistory;
