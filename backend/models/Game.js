const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        genre: {
            type: String,
            required: true,
            trim: true
        },

        platform: {
            type: String,
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 10
        },

        status: {
            type: String,
            required: true,
            enum: [
                "Playing",
                "Completed",
                "Wishlist",
                "Dropped"
            ]
        },

        hours: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        image: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Game", gameSchema);