'use strict';
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const userModel = require('../models/user');
const bcrypt = require('bcrypt');

// local strategy for username password login
passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await userModel.findOne({ email: username });
      console.log('Local strategy', user); // result is binary row
      if (user === undefined) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      // delete user.passport;
      const strippedUser = user.toObject();
      delete strippedUser.password;

      console.log('password delete user', strippedUser);

      return done(null, strippedUser, { message: 'Logged In Successfully' }); // use spread syntax to create shallow copy to get rid of binary row type
    } catch (err) {
      console.log('inside local strategy error');
      return done(err);
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (jwtPayload, done) => {
      console.log('payload', jwtPayload);
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      try {
        // const user = await userModel.findById(jwtPayload._id);
        // delete user.password;
        // console.log('pl user', user);
        // const strippedUser = {
        //   _id: user._id,
        //   email: user.email,
        //   full_name: user.full_name,
        // };
        const strippedUser = await userJModel.findById(
          jwtPayload._id,
          '-password-__v'
        );

        console.log('str user', strippedUser);
        return done(null, strippedUser);
      } catch (e) {
        return done(null, false);
      }
    }
  )
);

module.exports = passport;
