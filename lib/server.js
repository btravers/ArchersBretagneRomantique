import dbConfig from './config/db';
import User from './models/user';
import authRoutes from './routes/auth-routes';
import articlesRoutes from './routes/article-routes';
import usersRoutes from './routes/user-routes';

const fs = require('fs');
const https = require('https');
const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const logger = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passportLocal = require('passport-local');


// Creating server application
const app = express();

const server = https.createServer({
  cert:fs.readFileSync(__dirname + '/../app.crt'),
  key: fs.readFileSync(__dirname + '/../app.key')
}, app);

// Connecting to MongoDB instance
mongoose.connect(dbConfig.url);


// Express configuration
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(expressSession({
  secret: process.env.SESSION_SECREST || 'mySecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());


// Passport configuration
passport.use(new passportLocal.Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, done) => {
  User.findOne({
    email: email
  }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (user && user.verifyPassword(password)) {
      return done(null, user);
    }

    done('Bad credentials');
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


// Registering routes
app.use(express.static(__dirname + '/public'));

const auth = express.Router();
authRoutes(auth, passport);
app.use('/auth', auth);

const api = express.Router();
articlesRoutes(api);
usersRoutes(api);
app.use('/api', api);


// Starting server
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('http://127.0.0.1:%s', port);
});
