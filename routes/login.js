let express = require('express');
let router = express.Router();

module.exports = function (passport) {
  router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('../');
    } else {
      res.render('login');
    }
  });

  router.post('/', passport.authenticate('local-login', {
    successRedirect: '/users',
    failureRedirect: '/login',
    failureFlash: true
  }));

  return router;
};