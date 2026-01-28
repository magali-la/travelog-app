const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/User.js");

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },

    // verify callback function to check if there is a user already or if one needs to be created in the db
    async (accessToken, refreshToken, profile, cb) => {
        try {
            // check if the user already exists in the mongodb database via its google profile id
            let user = await User.findOne({ googleId: profile.id});

            // if user doesn't exist, create one with profile.id field and email, set username to the trimmed email
            if (!user) {
                user = await User.create({
                    username: profile.emails[0].value.split("@")[0],
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    provider: 'google'
                });
            }

            // if user is authenticated or created, passport will take the user nd use it in the route which will assign the JWT! basically this is the req.user
            return cb(null, user);

        } catch (error) {
            // stop login if there's an error
            return cb(error);
        }
    }
));