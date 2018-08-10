let express = require('express');
let router = express.Router();

module.exports = function (passport) {
  router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('../');
    } else {
      res.render('register');
    }
  });

  router.post('/', passport.authenticate('local-signup', {
    successRedirect: '/users',
    failureRedirect: '/register',
    failureFlash: true
  }));

  return router;
};