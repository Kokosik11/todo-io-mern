const mongoose = require("mongoose");
const Schema = mongoose.Schema

const passportLocalMongoose = require("passport-local-mongoose");

const Session = new Schema({
    refreshToken: {
        type: String,
        default: "",
    },
})

const Todo = new Schema({
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

const Action = new Schema({
    title: { 
        type: String, 
        default: "",
    },
    members: {
        type: [Member],
    },
    Todoes: {
        type: [Todo],
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
    Actions: {
        type: [Action]
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
        type: [Details]
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