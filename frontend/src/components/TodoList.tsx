import TodoItem from './TodoItem';
import styles from './TodoList.module.css';

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, currentStatus: boolean) => void;
}

const TodoList = ({ todos, onDelete, onToggleComplete }: TodoListProps) => {
  return (
    <ul className={styles.list}>
      {todos.map(todo => (
        <TodoItem 
          key={todo._id}
          todo={todo}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
