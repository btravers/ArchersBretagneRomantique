import dbConfig from './config/db';
import passportConfig from './config/passport';
import authRoutes from './routes/auth';
import articlesRoutes from './routes/articles';

const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');

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
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({
  secret: 'mySecretKey',
  proxy: true,
  resave: true,
  saveUninitialized: true,
  cookie: {secure: true}
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
