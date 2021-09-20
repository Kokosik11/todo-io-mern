const express = require("express");
const { verifyUser } = require("../authenticate.js");
const controller = require("../controllers/project.controller.js");
const Router = express.Router();

// Router.post("/update", verifyUser, controller.update);
// Router.post("/detele", verifyUser, controller.delete);
Router.post("/create", verifyUser, controller.create);
Router.get("/", verifyUser, controller.getProjects);

module.exports = Router;