// import jwt
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const expiration = '2h';

// token signing function for authentication in protected routes
function signToken({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}

module.exports = {signToken};