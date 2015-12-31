const util = {
  isAuthentecated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.send(404);
  }
};

export default util;
