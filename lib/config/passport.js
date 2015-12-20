import Strategy from 'passport-local';

import User from '../models/user';

function config(passport) {
  // Used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-signup', new Strategy({
    usernameField : 'email',
    passwordField : 'password'
  }, (email, password, done) => {
    process.nextTick(() => {
      User.findOne({
        email: email
      }, (err, user) => {
        // if there are any errors, return the error
        if (err) {
          return done(err);
        }

        // check to see if theres already a user with that email
        if (user) {
          return done(null, false);
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.email = email;
          newUser.password = newUser.generateHash(password);

          // save the user
          newUser.save((err) => {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new Strategy({
    usernameField : 'email',
    passwordField : 'password'
  }, (email, password, done) => {
    User.findOne({
      email: email
    }, (err, user) => {
      // if there are any errors, return the error before anything else
      if (err) {
        return done(err);
      }

      // Bad credentials
      if (!user || !user.validPassword(password)) {
        return done(null, false);
      }

      // all is well, return successful user
      return done(null, user);
    });
  }));

}

export default config;
