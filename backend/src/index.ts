import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import story_routes from "./routes/story_routes.js";
import auth_routes from "./routes/auth_routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();


connectDB();

app.use(cors());
app.use(express.json());

// Rotaları kullan
app.use("/api/story", story_routes);
app.use("/api/auth", auth_routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;