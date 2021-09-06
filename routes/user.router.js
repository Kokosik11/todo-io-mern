const express = require("express");
const passport = require("passport");
const { verifyUser } = require("../authenticate.js");
const controller = require("../controllers/user.controller.js");
const Router = express.Router();

Router.get("/logout", verifyUser, controller.logout);
Router.get("/me", verifyUser, controller.me);
Router.post("/refreshToken", controller.refreshToken);
Router.post("/login", passport.authenticate("local"), controller.login);
Router.post("/signup", controller.signup);

module.exports = Router;