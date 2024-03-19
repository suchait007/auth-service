require('dotenv').config();
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');

const { findById: findUser } = require('../service/users');
const { JWT_SECRET } = process.env;

const jwtSec = "5a00f294309ffa3ceabb45ac78fd7829089b32fa8847589e64a07fd69357ba1e";

const strategy = new Strategy( {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
    secretOrKey: jwtSec
}, 
async (jwtPayload, done) => {

        try {
        const user = await findUser({id: jwtPayload.id });

        if(!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            throw err;
        }

            done(null, user);
        } catch( error ) {
            done(error);
        }
    }
);

passport.use(strategy);

const initialize = () => {
    return passport.authenticate("jwt", {session: false});
};

const authenticate = () => {
    return passport.authenticate("jwt", {session: false});
}

module.exports = {
    initialize, 
    authenticate
};