import { useState, type FormEvent } from "react";
import styles from "./StoryGenerator.module.css";

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
      <h2>Hikaye Oluşturucu</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Hikaye konusu girin..."
          className={styles.textarea}
          disabled={isLoading}
        />
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? 'Oluşturuluyor...' : <>Hikaye Oluştur ✨</>}
        </button>
      </form>
      <div className={styles.storyOutput}>
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        )}
        {story && !isLoading && <p>{story}</p>}
      </div>
    </div>
  );
};
export default StoryGenerator;
