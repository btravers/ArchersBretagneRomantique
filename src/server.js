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
import { httpPort, httpsPort, dbUrl, sessionSecret } from './config';

const httpServer = express();

const httpsServer = https.createServer({
  cert: fs.readFileSync(path.join(__dirname, '../app.crt')),
  key: fs.readFileSync(path.join(__dirname, '../app.key'))
}, httpServer);

mongoose.connect(dbUrl, (err) => {
  console.log('Could not connect to mongo:\n', err);
});

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
httpServer.use(express.static(path.join(__dirname, 'public')));
httpServer.use(logger('dev'));
httpServer.use(cors());
httpServer.use(compression());
httpServer.use(bodyParser.urlencoded({
  extended: false
}));
httpServer.use(cookieParser());
httpServer.use(expressSession({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true
  }
}));

httpServer.use(passport.initialize());
httpServer.use(passport.session());

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
// Redirect to https
// -----------------------------------------------------------------------------
httpServer.all('*', (req, res, next) =>{
  if(req.secure){
    return next();
  }
  let host = req.host;
  if (httpsPort !== 443) {
    host += `:${httpsPort}`;
  }
  res.redirect(`https://${host}${req.url}`);
});

//
// Register API middleware
// -----------------------------------------------------------------------------
httpServer.use('/api/content', require('./api/content'));
httpServer.use('/api/articles', require('./api/article'));
httpServer.use('/api/auth', require('./api/auth')(passport));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
httpServer.get('*', async (req, res, next) => {
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
httpServer.listen(httpPort, () => {
  console.log(`The server is running at http://127.0.0.1:${httpPort}/`);
});
httpsServer.listen(httpsPort, () => {
  console.log(`The server is running at https://127.0.0.1:${httpsPort}/`);
});
