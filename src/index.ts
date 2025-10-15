import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import path from 'path';
import { fileURLToPath } from 'url';

// Rotaları içeri aktar
import story_routes from "./routes/story_routes.js";
import auth_routes from "./routes/auth_routes.js";

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Rotaları kullan
app.use("/api/story", story_routes);
app.use("/api/auth", auth_routes);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
