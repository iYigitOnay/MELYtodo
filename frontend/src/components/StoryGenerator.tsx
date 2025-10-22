import { useState, type FormEvent } from "react";
import styles from "./StoryGenerator.module.css";
import Skeleton from "./Skeleton"; // Import Skeleton component

interface StoryGeneratorProps {
  story: string;
  isLoading: boolean;
  onGenerate: (topic: string) => void;
}

const StoryGenerator = ({
  story,
  isLoading,
  onGenerate,
}: StoryGeneratorProps) => {
  const [topic, setTopic] = useState("");
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      return;
    }
    onGenerate(topic);
  };

  return (
    <div className={styles.container}>
      <h2>Mely Anneanne Anlatıyor...</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Hikaye konusu girin..."
          className={styles.textarea}
          disabled={isLoading}
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Oluşturuluyor..." : <>Hikaye Oluştur ✨</>}
        </button>
      </form>
      <div className={styles.storyOutput}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <Skeleton
              height="20px"
              width="80%"
              style={{ marginBottom: "10px" }}
            />
            <Skeleton
              height="20px"
              width="90%"
              style={{ marginBottom: "10px" }}
            />
            <Skeleton height="20px" width="70%" />
          </div>
        ) : (
          story && <p>{story}</p>
        )}
      </div>
    </div>
  );
};
export default StoryGenerator;
