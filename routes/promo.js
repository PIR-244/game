exports.get = function (req, res) {
  res.render('promo');
};

var HttpError = require('../error').HttpError;
var User = require('../models/user').User;
var AuthError = require('../models/user').AuthError;

exports.post = function (req, res, next) {
var user_id = req.session.user;

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

      user.promo.close_promo = new Date(user.last_action.getTime() + 1000*60*60*4);

      user.save(function (err) {
        if(err) return next(err);
    });
        res.send();
      });
}
