const mongoose = require("mongoose");
const Schema = mongoose.Schema

const passportLocalMongoose = require("passport-local-mongoose");

const Session = new Schema({
    refreshToken: {
        type: String,
        default: "",
    },
})

const Action = new Schema({
    title: {
        type: String,
        default: "",
    },
    isCompleted: {
        type: Boolean,
        default: false,
    }
})

const Member = new Schema({
    Members: [String]
}, { _id: false });

const Project = new Schema({
    creationDate: {
        type: Date,
        default: Date.now()
    },
    title: { 
        type: String, 
        default: "",
    },
    description: {
        type: String,
        default: "Description of the project"
    },
    members: {
        type: [Member],
    },
    Todoes: {
        type: [Action],
    },
})

const Details = new Schema({
    birth: {
        type: String,
        default: "",
    },
    avatarUrl: {
        type: String,
        default: "",
    },
    Project: {
        type: [Project],
        default: []
    }
})

const User = new Schema({
    username: {
        type: String,
        default: "",
    },
    authStrategy: {
        type: String,
        default: "local",
    },
    refreshToken: {
        type: [Session],
    },
    details: {
        type: Details,
        default: {}
    }
})

User.set("toJSON", {
    transform: (doc, ret, options) => {
        delete ret.refreshToken;
        return ret;
    }
})

User.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", User);