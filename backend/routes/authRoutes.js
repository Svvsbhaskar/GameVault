const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const JWT_SECRET =
    process.env.JWT_SECRET || "gamevault_secret_key";


/* =========================================================
   CREATE TOKEN
   ========================================================= */

function createToken(user) {

    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email
        },
        JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
}


/* =========================================================
   REGISTER
   POST /api/auth/register
   ========================================================= */

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        /* -----------------------------------------
           Validate required fields
           ----------------------------------------- */

        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });

        }


        /* -----------------------------------------
           Validate password
           ----------------------------------------- */

        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must be at least 6 characters"
            });

        }


        const cleanEmail =
            email
                .toLowerCase()
                .trim();


        /* -----------------------------------------
           Check existing user
           ----------------------------------------- */

        const existingUser =
            await User.findOne({
                email: cleanEmail
            });


        if (existingUser) {

            return res.status(400).json({
                message:
                    "User with this email already exists"
            });

        }


        /* -----------------------------------------
           Hash password
           ----------------------------------------- */

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        /* -----------------------------------------
           Create user
           ----------------------------------------- */

        const user =
            new User({

                name:
                    name.trim(),

                email:
                    cleanEmail,

                password:
                    hashedPassword

            });


        const savedUser =
            await user.save();


        /* -----------------------------------------
           Create token
           ----------------------------------------- */

        const token =
            createToken(savedUser);


        /* -----------------------------------------
           Response
           ----------------------------------------- */

        res.status(201).json({

            message:
                "Registration successful",

            token,

            user: {

                id:
                    savedUser._id,

                name:
                    savedUser.name,

                email:
                    savedUser.email

            }

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to register user",

            error:
                error.message

        });

    }

});


/* =========================================================
   LOGIN
   POST /api/auth/login
   ========================================================= */

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        /* -----------------------------------------
           Validate required fields
           ----------------------------------------- */

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({
                message:
                    "Email and password are required"
            });

        }


        const cleanEmail =
            email
                .toLowerCase()
                .trim();


        /* -----------------------------------------
           Find user
           ----------------------------------------- */

        const user =
            await User.findOne({
                email: cleanEmail
            });


        if (!user) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });

        }


        /* -----------------------------------------
           Compare password
           ----------------------------------------- */

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                message:
                    "Invalid email or password"
            });

        }


        /* -----------------------------------------
           Create token
           ----------------------------------------- */

        const token =
            createToken(user);


        /* -----------------------------------------
           Response
           ----------------------------------------- */

        res.status(200).json({

            message:
                "Login successful",

            token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email

            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to login",

            error:
                error.message

        });

    }

});


module.exports = router;