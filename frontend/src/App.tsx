import { useState, useEffect } from 'react';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import './App.css';

export interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // --- API ve State Mantığı --- //

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:3000/todos');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error("Todo'ları çekerken hata:", error);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async (text: string) => {
    try {
      const response = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const newTodo = await response.json();
      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      console.error("Todo eklerken hata:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Network response was not ok');
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error("Todo silerken hata:", error);
    }
  };

  const handleToggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Todo güncellerken hata:", error);
    }
  };

  // --- Arayüz Çizim Mantığı --- //

  return (
    <div className="App">
      <h1>MELY Grandma's Stories</h1>
      <AddTodoForm onAddTodo={handleAddTodo} />
      <TodoList 
        todos={todos}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
}

export default App;