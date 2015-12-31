import { Router } from 'express';
import authUtil from '../util/auth';
import User from '../models/user';

export default function (passport) {

  const router = new Router();

  router
    .post('/login', passport.authenticate('local'), (req, res) => {
      res.redirect('/');
    })
    .post('/signup', (req, res) => {
      const user = new User({
        email: req.body.email,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
      });

      console.log('Adding user for email: %s', user.email);

      user.save((err) => {
        if (err) {
          res.send(err);
        }

        res.json({
          message: 'User successfully registered'
        });
      });
    })
    .get('/logout', (req, res) => {
      req.logout();
      res.redirect('/');
    });

  return router;
}
