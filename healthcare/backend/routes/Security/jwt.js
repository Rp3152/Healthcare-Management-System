const jwt = require("jsonwebtoken");
const express = require("express");

const app = express();
app.use(express.json());

const secretKey = "my-secret-key";

const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
    token = token ? token.split(" ") : "";
    token = token[1] ? token[1] : "";
    if (!token) {
        return res.status(403).json({ message: "Token not provided" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};

function generateToken(payload) {
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
    return token;
}

module.exports = { generateToken, verifyToken };
