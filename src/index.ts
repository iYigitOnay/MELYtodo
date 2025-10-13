import express, { Request, Response } from "express";
import todo_routes from "./routes/todo_routes";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/db";

connectDB();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/todos", todo_routes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
