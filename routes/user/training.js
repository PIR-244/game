var HttpError = require('../../error').HttpError;
var User = require('../../models/user').User;
var AuthError = require('../../models/user').AuthError;

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

      if (user.training == 1 || user.training == 4 || user.training == 5 || user.training == 6 || user.training == 11 || user.training == 13 || user.training == 15 || user.training == 21 || user.training == 22 || user.training == 23) {
        user.training++;
      } else if (user.training == 10) {
        user.training++;
        user.pesos += 900;
      } else if (user.training == 16) {
        user.training++;
        user.gold_bars += 10;
        if (user.bank.storage.slot1.activity == 1) {
          user.training++;
        }
      } else if (user.training == 20) {
        user.training++;
        user.gold_bars += 15;
      } else if (user.training == 27) {
        user.training++;
        user.pesos += 5000;
      } else if (user.training == 29) {
        user.training = 0;
      }

      user.save(function (err) {
        if(err) return next(err);
    });
        res.send();
      });
}
