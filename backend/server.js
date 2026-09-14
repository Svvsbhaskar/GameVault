const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const gameRoutes = require("./routes/gameRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

const PORT =
    process.env.PORT || 5000;


// =========================================================
// CORS
// =========================================================

// Allow requests from the frontend.
// During local development this allows all origins.
// We can restrict this to the deployed frontend later.
app.use(
    cors()
);


// =========================================================
// BODY PARSER
// =========================================================

// Allow JSON requests with compressed game images.
app.use(
    express.json({
        limit: "2mb"
    })
);


// =========================================================
// AUTHENTICATION ROUTES
// =========================================================

app.use(
    "/api/auth",
    authRoutes
);


// =========================================================
// GAME ROUTES
// =========================================================

app.use(
    "/api/games",
    gameRoutes
);


// =========================================================
// TEST ROUTE
// =========================================================

app.get(
    "/",
    (req, res) => {

        res.send(
            "🎮 GameVault Backend is Running!"
        );

    }
);


// =========================================================
// CONNECT TO MONGODB
// =========================================================

mongoose
    .connect(
        process.env.MONGODB_URI
    )
    .then(() => {

        console.log(
            "✅ MongoDB connected successfully!"
        );


        app.listen(
            PORT,
            () => {

                console.log(
                    `🎮 GameVault server running on port ${PORT}`
                );

            }
        );

    })
    .catch(
        (error) => {

            console.error(
                "❌ MongoDB connection failed:",
                error.message
            );

        }
    );