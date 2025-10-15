import styles from './TranslationView.module.css';

interface TranslationViewProps {
  translatedStory: string;
  isLoading: boolean;
}

const TranslationView = ({ translatedStory, isLoading }: TranslationViewProps) => {
  return (
    <div className={styles.container}>
      <h2>Basitleştirilmiş Çeviri</h2>
      <div className={styles.storyOutput}>
        {isLoading ? (
          <p>Çevriliyor...</p>
        ) : (
          <p>{translatedStory || "Hikaye oluşturulduktan sonra çevirisi burada görünecek."}</p>
        )}
      </div>
      {/* Dil seçimi daha sonra buraya eklenebilir */}
    </div>
  );
};

export default TranslationView;