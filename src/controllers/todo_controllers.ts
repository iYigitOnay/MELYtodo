import { Request, Response } from "express";
import { Todo } from "../models/todo_model";

let todos: Todo[] = [];
let nextId: number = 1;

/**
 * @desc
 * @route GET /todos
 */

export const getAllTodos = (req: Request, res: Response) => {
  res.status(200).json(todos);
};

export const addTodo = (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTodo: Todo = {
    id: nextId++,
    title: title,
    completed: false,
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
};

export const deleteTodo = (req: Request, res: Response) => {
  const { id } = req.params;

  const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  todos.splice(todoIndex, 1);

  res.status(200).json({ message: "Todo deleted successfully" });
};

export const updateTodo = (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const todo = todos.find((todo) => todo.id === parseInt(id));

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  if (title !== undefined) {
    todo.title = title;
  }

  if (completed !== undefined) {
    todo.completed = completed;
  }

  res.status(200).json(todo);
};
