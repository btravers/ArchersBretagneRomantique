const utils = {
  isLoggedIn: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.statue(404).end();
  }
};

export default utils;
