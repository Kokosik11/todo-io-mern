const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const config = require("config");

const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../authenticate");

exports.signup = (req, res, next) => {
    if(!req.body.username) {
        res.statusCode = 500
        res.send({
            name: "UsernameError",
            message: "The username is required"
        })
    } else {
        User.register(
            new User({ username: req.body.username }),
            req.body.password,
            (err, user) => {
                if(err) {
                    res.statusCode = 500;
                    res.send(err);
                } else {
                    user.username = req.body.username
                    const token = getToken({ _id: user._id });
                    const refreshToken = getRefreshToken({ _id: user._id });
                    user.refreshToken.push({ refreshToken });

                    user.save((err, user) => {
                        if(err) {
                            res.statusCode = 500;
                            res.send(err);
                        } else {
                            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
                            res.send( { success: true, token })
                        }
                    })
                }
            }
        )
    }
}

exports.login = (req, res, next) => {
    const token = getToken({ _id: req.user._id })
    const refreshToken = getRefreshToken({ _id: req.user._id })
    User.findById(req.user._id).then(
        user => {
        user.refreshToken.push({ refreshToken })
        user.save((err, user) => {
            if (err) {
                res.statusCode = 500
                res.send(err)
            } else {
                res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS)
                res.send({ success: true, token })
            }
        })
        },
        err => next(err)
    )
}

exports.refreshToken = (req, res, next) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;

    if(refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, config.get("Session.REFRESH_TOKEN_SECRET"));
            const userID = payload._id;

            User.findOne({ _id: userID }).then(user => {
                if(user) {
                    const tokenIndex = user.refreshToken.findIndex(item => item.refreshToken === refreshToken);
    
                    if(tokenIndex === -1) {
                        res.statusCode = 401;
                        res.send("Unauthorized");
                    } else {
                        const token = getToken({ _id: userID });
                        const newRefreshToken = getRefreshToken({ _id: userID });
    
                        user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };
                        user.save((err, user) => {
                            if(err) {
                                res.statusCode = 500;
                                res.send(err);
                            } else {
                                res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
                                res.send({ success: true, token });
                            }
                        })
                    }
                } else {
                    res.statusCode = 401;
                    res.send("Unauthorized");
                }
            }, 
            err => next(err)
            )
        }
        catch(err) {
            res.statusCode = 401;
            res.send("Unauthorized");
        }
    } else {
        res.statusCode = 401;
        res.send("Unauthorized");
    }
}

exports.me = (req, res, next) => {
    res.send(req.user);
}

exports.logout = (req, res, next) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;

    User.findById(req.user._id).then(user => {
        const tokenIndex = user.refreshToken.findIndex(item => item.refreshToken === refreshToken);

        if(tokenIndex !== -1) {
            user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
        }

        user.save((err, user) => {
            if(err) {
                res.statusCode = 500;
                res.send(err);
            } else {
                res.clearCookie("refreshToken", COOKIE_OPTIONS);
                res.send({ success: true });
            }
        })
    }, err => next(err))
}