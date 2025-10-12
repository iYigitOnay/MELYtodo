import express, { Request, Response } from "express";
import todo_routes from "./routes/todo_routes";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use("/todos", todo_routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, MELYtodo!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
