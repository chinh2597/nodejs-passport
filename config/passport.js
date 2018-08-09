let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/users');

module.exports = function (passport) {

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
        passReqToCallback : true
      }, (req, username, password, done) => {
        User.findOne({'Username': username}, (err, user) => {
          if (err) return done(err);
          if (user) {
            return done(null, false, req.flash('signupMessage', 'That username is already taken.'))
          } else {
            let user = new User();
            user.Username = username;
            user.Password = user.generateHash(password);
            user.save(err =>{
              if(err) throw err;
              return done(null, user);
            });
          }
        });
      }
  ));

  passport.use('local-login',new LocalStrategy({
        passReqToCallback : true
      }, (req, username, password, done)=>{
        User.findOne({'Username': username}, (err, user)=>{
          if(err) return done(err);
          if(!user){
            return done(null, false, req.flash('loginMessage', 'Username invalid'));
          }
          if(!user.validPassword(password)){
            return done(null, false, req.flash('loginMessage', "Password invalid"));
          }
          return done(null, user);
        });
      }
  ));

};