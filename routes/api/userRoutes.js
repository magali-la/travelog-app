const router = require('express').Router();
const User = require('../../models/User.js');
// destructure this to extract the signToken function since auth.js exports two functions
const { signToken } = require('../../utils/auth.js');

// ROUTES - induces
// Create - post a new user /api/users/register
router.post("/register", async (req, res) => {
  try {
    // create a new user
    const user = await User.create(req.body);
    // assign a token to the user
    const token = signToken(user);

    // response needs to remove the password field for security
    const userObj = user.toObject();
    delete userObj.password;

    // success message for created user, only report 
    res.status(201).json({ token, user: userObj });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
 
// POST -authenticate a user and return a token
router.post("/login", async (req, res) => {
    try {
        // make sure the req.body only includes email and password fields
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        const user = await User.findOne({ email: req.body.email });
 
        if (!user) {
            return res.status(400).json({ message: "Incorrect email or password" });
        }
        
        const correctPw = await user.isCorrectPassword(req.body.password);
        
        if (!correctPw) {
            return res.status(400).json({ message: "Incorrect email or password" });
        }

        // assign the token with the user
        const token = signToken(user);

        // set an object to remove password from response, instead of explicitly defining a payload in case user fields change over time
        const userObj = user.toObject();
        delete userObj.password;

        // response is the json object with the token and the user, but as payload without the password
        res.json({ token, user: userObj });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
 
module.exports = router;