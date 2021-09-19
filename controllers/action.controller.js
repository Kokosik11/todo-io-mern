const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const config = require("config");

const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../authenticate");

exports.getAction = (req, res, next) => {
    User.findById(req.user._id).then(user => {
        res.send(user.details.Actions);
    })
    // res.send(req.user.details.Actions);
}

exports.create = (req, res, next) => {
    User.findByIdAndUpdate(req.user._id).then(
        user => {
            user.details.Actions = [ ...user.details.Actions, {
                title: req.body.title
            }]
            user.save((err, user) => {
                if (err) {
                    res.statusCode = 500
                    res.send(err)
                } else {
                    res.send({ success: true })
                }
            })
        },
        err => next(err)
    )
}