import styles from "./TranslationView.module.css";
import Skeleton from "./Skeleton"; // Import Skeleton component

interface TranslationViewProps {
  translatedStory: string;
  isLoading: boolean;
}

const TranslationView = ({
  translatedStory,
  isLoading,
}: TranslationViewProps) => {
  return (
    <div className={styles.container}>
      <h2>Basitleştirilmiş Çeviri</h2>
      <div className={styles.storyOutput}>
        {isLoading ? (
          <div className={styles.loadingContainer}> {/* Add a loading container for skeletons */}
            <Skeleton height="20px" width="80%" style={{ marginBottom: '10px' }} />
            <Skeleton height="20px" width="90%" style={{ marginBottom: '10px' }} />
            <Skeleton height="20px" width="70%" />
          </div>
        ) : (
          <p>
            {translatedStory ||
              "Hikaye oluşturulduktan sonra çevirisi burada görünecek."}
          </p>
        )}
      </div>
      {/* Dil seçimi daha sonra buraya eklenebilir */}
    </div>
  );
};

export default TranslationView;
