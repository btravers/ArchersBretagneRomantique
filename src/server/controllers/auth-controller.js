import User from '../models/user';

const controller = {
  login: function(req, res) {
    res.redirect('/');
  },

  signup: function(req, res) {
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
  },

  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  }
};

export default controller;
