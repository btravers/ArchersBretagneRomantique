import express from 'express';

function routes(app, passport) {
  const auth = express.Router();

  auth.post('/signup', passport.authenticate('local-signup'), (req, res) => {
    
  });

  auth.post('/login', passport.authenticate('local-login'), (req, res) => {

  });

  auth.get('/logout', (req, res) => {
    req.logout();
    req.end();
  });

  app.use('/auth', auth);
}

export default routes;
