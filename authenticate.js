const passport = require("passport");
const jwt = require("jsonwebtoken");

const config = require("config");

const dev = config.get("Server.MODE") !== "production";

exports.COOKIE_OPTIONS = {
    httpOnly: true,
    secure: !dev,
    signed: true,
    maxAge: eval(config.get("Session.REFRESH_TOKEN_EXPIRY")) * 1000,
    sameSite: "none"
}

exports.getToken = user => {
    return jwt.sign(user, config.get("Session.JWT_SECRET"), {
        expiresIn: eval(config.get("Session.SESSION_EXPIRY"))
    })
}

exports.getRefreshToken = user => {
    const refreshToken = jwt.sign(user, config.get("Session.REFRESH_TOKEN_SECRET"), {
        expiresIn: eval(config.get("Session.REFRESH_TOKEN_EXPIRY"))
    })

    return refreshToken;
}

exports.verifyUser = passport.authenticate("jwt", { session: false });