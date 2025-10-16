import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Rotaları içeri aktar
import story_routes from "./routes/story_routes.js";
import auth_routes from "./routes/auth_routes.js";

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

// Rotaları kullan
app.use("/api/story", story_routes);
app.use("/api/auth", auth_routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});