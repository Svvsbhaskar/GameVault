const express = require("express");

const router =
    express.Router();

const Game =
    require("../models/Game");

const protect =
    require("../middleware/authMiddleware");


/* =========================================================
   ALL GAME ROUTES REQUIRE LOGIN
   ========================================================= */


/* =========================================================
   GET ALL GAMES
   GET /api/games
   ========================================================= */

router.get(
    "/",
    protect,
    async (req, res) => {

        try {

            const games =
                await Game
                    .find({
                        user: req.user.id
                    })
                    .sort({
                        createdAt: -1
                    });


            res.status(200).json(
                games
            );


        } catch (error) {

            console.error(
                "Error fetching games:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to fetch games",

                error:
                    error.message

            });

        }

    }
);


/* =========================================================
   GET ONE GAME
   GET /api/games/:id
   ========================================================= */

router.get(
    "/:id",
    protect,
    async (req, res) => {

        try {

            const game =
                await Game.findOne({
                    _id: req.params.id,
                    user: req.user.id
                });


            if (!game) {

                return res
                    .status(404)
                    .json({

                        message:
                            "Game not found"

                    });

            }


            res.status(200).json(
                game
            );


        } catch (error) {

            console.error(
                "Error fetching game:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to fetch game",

                error:
                    error.message

            });

        }

    }
);


/* =========================================================
   CREATE GAME
   POST /api/games
   ========================================================= */

router.post(
    "/",
    protect,
    async (req, res) => {

        try {

            const {
                name,
                genre,
                platform,
                rating,
                status,
                hours,
                image
            } = req.body;


            const game =
                new Game({

                    user:
                        req.user.id,

                    name,

                    genre,

                    platform,

                    rating,

                    status,

                    hours,

                    image:
                        image || ""

                });


            const savedGame =
                await game.save();


            res.status(201).json(
                savedGame
            );


        } catch (error) {

            console.error(
                "Error creating game:",
                error
            );


            res.status(400).json({

                message:
                    "Failed to create game",

                error:
                    error.message

            });

        }

    }
);


/* =========================================================
   UPDATE GAME
   PUT /api/games/:id
   ========================================================= */

router.put(
    "/:id",
    protect,
    async (req, res) => {

        try {

            const updateData = {

                name:
                    req.body.name,

                genre:
                    req.body.genre,

                platform:
                    req.body.platform,

                rating:
                    req.body.rating,

                status:
                    req.body.status,

                hours:
                    req.body.hours

            };


            /* -----------------------------------------
               Replace image only when sent
               ----------------------------------------- */

            if (
                Object.prototype.hasOwnProperty.call(
                    req.body,
                    "image"
                )
            ) {

                updateData.image =
                    req.body.image || "";

            }


            /* -----------------------------------------
               Update only the logged-in user's game
               ----------------------------------------- */

            const updatedGame =
                await Game.findOneAndUpdate(

                    {
                        _id: req.params.id,
                        user: req.user.id
                    },

                    updateData,

                    {
                        new: true,
                        runValidators: true
                    }

                );


            if (!updatedGame) {

                return res
                    .status(404)
                    .json({

                        message:
                            "Game not found"

                    });

            }


            res.status(200).json(
                updatedGame
            );


        } catch (error) {

            console.error(
                "Error updating game:",
                error
            );


            res.status(400).json({

                message:
                    "Failed to update game",

                error:
                    error.message

            });

        }

    }
);


/* =========================================================
   DELETE GAME
   DELETE /api/games/:id
   ========================================================= */

router.delete(
    "/:id",
    protect,
    async (req, res) => {

        try {

            const deletedGame =
                await Game.findOneAndDelete({

                    _id:
                        req.params.id,

                    user:
                        req.user.id

                });


            if (!deletedGame) {

                return res
                    .status(404)
                    .json({

                        message:
                            "Game not found"

                    });

            }


            res.status(200).json({

                message:
                    "Game deleted successfully",

                game:
                    deletedGame

            });


        } catch (error) {

            console.error(
                "Error deleting game:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to delete game",

                error:
                    error.message

            });

        }

    }
);


module.exports =
    router;