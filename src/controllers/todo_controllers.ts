import { Request, Response } from "express";
import Todo from "../models/todo_model";

/**
 * @desc
 * @route GET /todos
 */

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find({});
    res.status(200).json(todos);
  } catch (err) {
    console.log(res.status(500).json({ message: "Error fetching todos" }));
  }
};

export const addTodo = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text field is required" });
    }

    const newTodo = await Todo.create({ text });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleteTodo = await Todo.findByIdAndDelete(id);

    if (!deleteTodo) {
      return res.status(404).json({ message: "Toda not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting todo" });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(500).json({ message: "Error updating todo" });
  }
};
