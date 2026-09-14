const jwt = require("jsonwebtoken");

const JWT_SECRET =
    process.env.JWT_SECRET || "gamevault_secret_key";


/* =========================================================
   AUTHENTICATION MIDDLEWARE
   ========================================================= */

function protect(req, res, next) {

    try {

        const authHeader =
            req.headers.authorization;


        /* -----------------------------------------
           Check Authorization header
           ----------------------------------------- */

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({
                message:
                    "Authentication required"
            });

        }


        /* -----------------------------------------
           Extract token
           ----------------------------------------- */

        const token =
            authHeader.split(" ")[1];


        if (!token) {

            return res.status(401).json({
                message:
                    "Authentication token missing"
            });

        }


        /* -----------------------------------------
           Verify token
           ----------------------------------------- */

        const decoded =
            jwt.verify(
                token,
                JWT_SECRET
            );


        /* -----------------------------------------
           Attach user to request
           ----------------------------------------- */

        req.user = decoded;


        next();


    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );


        if (
            error.name ===
            "TokenExpiredError"
        ) {

            return res.status(401).json({
                message:
                    "Authentication token expired"
            });

        }


        return res.status(401).json({
            message:
                "Invalid authentication token"
        });

    }

}


module.exports =
    protect;