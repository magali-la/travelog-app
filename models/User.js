const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: 4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Must use a valid email address"] 
    },
    password: {
        type: String,
        minlength: 6,
        // TODO: set up full protection for OAuth, where password isn't provided, so use another field as a fallback once determined
        validate: {
            validator: function(pass) {
                return pass;
            }
        }
    }
});

// BCRYPT
// hash email/password users' passwords with pre-save middleware
userSchema.pre("save", async function () {
    // add protections for OAuth, where only hashing if a password exists in the req.body when creating a new user / this is ignored with OAuth users
    if (this.password && (this.isNew || this.isModified("password"))) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    };
});

// compare incoming password with hashed password for login
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;