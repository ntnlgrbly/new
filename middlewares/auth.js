const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

exports.auth = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json({ err: "You must send token in header to this endpoint" })
    }
    try {
        let decodeToken = jwt.verify(token, secret.jwtSecret);
        req.tokenData = decodeToken;
        next();
    }
    catch (err) {
        return res.status(401).json({ err: "Token invalid (if you hacker) or expired" });
    }
}

exports.authAdmin = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json({ err: "You must send token in header to this endpoint" })
    }
    try {
        let decodeToken = jwt.verify(token, secret.jwtSecret);
        // check if user role is admin
        if (decodeToken.role == "admin") {
            req.tokenData = decodeToken;
            next();
        }
        else {
            return res.status(401).json({ err: "You must be admin in this endpoint" })
        }
    }
    catch (err) {
        return res.status(401).json({ err: "Token invalid (if you hacker) or expired" });
    }
}