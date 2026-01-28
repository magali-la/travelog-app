const router = require("express").Router();
const passport = require("passport");
const { signToken } = require('../utils/auth.js');

// Google OAuth routes and callback route
router.get("/google",
    passport.authenticate('google', {
        scope: ['email'],
        // set session to false for pure JWT authentication and authorization
        session: false
    })
);

router.get("/google/callback", 
    passport.authenticate('google', {
        // temporary redirect route for backend only
        failureRedirect: '/failure',
        // set session to false for pure JWT authentication and authorization
        session: false  
    }),

    function(req, res) {
        // Successful authentication, assign the token
        const token = signToken(req.user);

        // respond with the token and the user's email and username - ignore the googleID for security
        res.json({ 
            token,
            user: {
                username: req.user.username,
                email: req.user.email
            }
        });
    }
);

// set a temp failure redirect route which just sends json data instead of redirecting to a frontend login
router.get("/failure", (req, res) => {
    res.status(401).json({ message: "OAuth login failed"});
});

module.exports = router;