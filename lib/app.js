import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressSession from 'express-session';

import dbConfig from './config/db';
import passportConfig from './config/passport';

import authRoutes from './routes/auth';
import articlesRoutes from './routes/articles';

// Creating server application
const app = express();

// Connecting to MongoDB instance
mongoose.connect(dbConfig.url);

// Passport configuration
passportConfig(passport);

// Express configuration
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
  secret: 'mySecretKey',
    proxy: true,
    resave: true,
    saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(compression());

// Registering routes
authRoutes(app, passport);

const api = express();
articlesRoutes(api, passport);
app.use('/api', api);

// Starting server
const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening as http://%s:%s', host, port);
});
