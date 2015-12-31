import 'babel-core/polyfill';

import fs from 'fs';
import path from 'path';
import https from 'https';

import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import logger from 'morgan';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passportLocal from 'passport-local';
import Html from './components/Html';
import { port, dbUrl, sessionSecret } from './config';

const app = global.server = express();

const server = https.createServer({
  cert: fs.readFileSync(path.join(__dirname, '../app.crt')),
  key: fs.readFileSync(path.join(__dirname, '../app.key'))
}, app);

mongoose.connect(dbUrl, (err) => {
  console.log('Could not connect to mongo:\n', err);
});

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(expressSession({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true
  }
}));

app.use(passport.initialize());
app.use(passport.session());

//
// Configure Passport
// -----------------------------------------------------------------------------
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

    if (user) {
      user.verifyPassword(password).then((valid) => {
        if (valid) {
          return done(null, user);
        }
      }).then((err) => {
        console.log(err);
      });
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

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use('/api/content', require('./api/content'));
app.use('/api/articles', require('./api/article'));
app.use('/api/auth', require('./api/auth')(passport));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
server.get('*', async (req, res, next) => {
  try {
    let statusCode = 200;
    const data = { title: '', description: '', css: '', body: '', entry: assets.main.js };
    const css = [];
    const context = {
      insertCss: styles => css.push(styles._getCss()),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => statusCode = 404,
    };

    await Router.dispatch({ path: req.path, query: req.query, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send('<!doctype html>\n' + html);
  } catch (err) {
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
