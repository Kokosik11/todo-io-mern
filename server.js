// ***** Libs ***** //
const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");

const app = express();

require("./strategies/JwtStrategy")
require("./strategies/LocalStrategy")
require("./authenticate")

// ***** Configs ***** //
const { PORT } = config.get("Server");
const DBConfig = config.get("DB");

const whitelist = config.get("Server.WHITELIST_DOMAINS")
    ? config.get("Server.WHITELIST_DOMAINS").split(",")
    : []

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(cookieParser(config.get("Session.COOKIE_SECRET")));

const userRouter = require("./routes/user.router.js");


app.use("/users", userRouter)

// const homeRouter = require("./routes/homeRouter.js");

// app.use('/user', userRouter);
// app.use('/', homeRouter);


mongoose.connect(DBConfig.URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true

}, function(err){
    if(err) return console.log(err);
    app.listen(PORT || 3010, function(){
        console.log("Сервер ожидает подключения...");
    });
});
