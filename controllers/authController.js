'use strict';
const jwt = require('jsonwebtoken');
const passport = require('../utils/pass');

const auth = (req, res) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', { session: false },async (err, user, info) => {
        try {
          if (err || !user) {
            reject(info.message);
          }
          req.login(user, { session: false }, async (err) => {
            if (err) {
              reject(err);
            }
            const token = jwt.sign(user, process.env.SECRET_KEY);
            resolve({ user, token });
          });
        } catch (e) {
          reject(e.message);
        }
      }
    )(req, res);
  });
};

module.exports = {
  auth,
};
