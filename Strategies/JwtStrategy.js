const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
      ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user.model.js");
const config = require("config");

const SConfig = config.get("Session");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SConfig.JWT_SECRET;

passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if(err) {
                return done(err, false);
            }
            if(user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
    })
)
