import styles from './TodoItem.module.css';

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
}

const TodoItem = ({ todo, onDelete, onToggleComplete }: TodoItemProps) => {
  return (
    <li className={`${styles.item} ${todo.completed ? styles.completed : ''}`}>
      <span 
        className={styles.text} 
        onClick={() => onToggleComplete(todo._id, todo.completed)}
      >
        {todo.text}
      </span>
      <div className={styles.buttons}>
        <button 
          className={styles.button} 
          onClick={() => onToggleComplete(todo._id, todo.completed)}
        >
          {todo.completed ? 'Geri Al' : 'Tamamla'}
        </button>
        <button 
          className={`${styles.button} ${styles.deleteButton}`} 
          onClick={() => onDelete(todo._id)}
        >
          Sil
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
