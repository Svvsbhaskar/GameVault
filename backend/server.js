const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const gameRoutes = require("./routes/gameRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());

// Allow JSON requests with compressed game images
app.use(express.json({ limit: "2mb" }));

// Authentication routes
app.use("/api/auth", authRoutes);

// Game routes
app.use("/api/games", gameRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("🎮 GameVault Backend is Running!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(
                `🎮 GameVault server running on http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error(
            "❌ MongoDB connection failed:",
            error.message
        );
    });