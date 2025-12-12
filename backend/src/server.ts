import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
