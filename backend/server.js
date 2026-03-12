// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Database connection
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/mentor", require("./routes/mentorRoutes"));
app.use("/api/head", require("./routes/headRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/common", require("./routes/commonRoutes"));


// Default route
app.get("/", (req, res) => {
    res.send("🎓 College Project Allocation API is running...");
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
