const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const config = require("config");

const { getToken, COOKIE_OPTIONS, getRefreshToken } = require("../authenticate");

exports.getProjects = (req, res, next) => {
    User.findById(req.user._id).then(user => {
        res.send(user.details.Project);
    })
    // res.send(req.user.details.Actions);
}

exports.create = (req, res, next) => {
    console.log("hi")
    User.findByIdAndUpdate(req.user._id).then(
        user => {
            user.details.Project = [ ...user.details.Project, {
                title: req.body.projectTitle,
                description: req.body.projectDescription,
                actions: [...req.body.projectActions],
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