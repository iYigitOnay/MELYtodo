import { useState, FormEvent } from "react";
import styles from "./AddTodoForm.module.css";

interface AddTodoFormProps {
  onAddTodo: (text: string) => void;
}

const AddTodoForm = ({ onAddTodo }: AddTodoFormProps) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAddTodo(text); 
    setText(""); 
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
        value={text}
        placeholder="Yeni bir görev ekle..."
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className={styles.button}>
        Ekle
      </button>
    </form>
  );
};

export default AddTodoForm;
