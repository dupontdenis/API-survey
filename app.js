import express from "express";
import questionRoutes from "./API/routes/questionRoutes.js";
import { errorHandler } from "./API/middleware/errorHandler.js";

const app = express();
app.use(express.json());

// Serve static files
app.use(express.static("public"));

// Mount the QCM API routes

// Redirect root to /API/survey
app.get("/", (req, res) => {
  res.redirect("/API/survey");
});
app.use("/API/survey", questionRoutes);

// Centralized error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
