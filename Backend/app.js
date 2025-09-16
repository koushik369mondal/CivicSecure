// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Log the loaded Mongo URI to debug
console.log("Loaded Mongo URI:", process.env.MONGODB_URI);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI) // ✅ removed deprecated options
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
