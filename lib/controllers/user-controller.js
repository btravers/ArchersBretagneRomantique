import User from '../models/user';

const controller = {

  getUsers: function(req, res) {
    console.log('Retrieving all users');

    User.find((err, users) => {
      if (err) {
        res.send(err);
      }

      res.json(users);
    });
  }

};

export default controller;
