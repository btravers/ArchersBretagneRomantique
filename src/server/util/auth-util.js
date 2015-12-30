const util = {
  isAuthentecated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.send(404);
  },

  isAuthentecatedWithRedirection: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect('/');
  }
};

export default util;
