var Noted = require('../../models/noted').Noted;
var AuthError_not = require('../../models/noted').AuthError_not;
var HttpError = require('../../error').HttpError;
var User = require('../../models/user').User;
var AuthError = require('../../models/user').AuthError;


exports.post = function (req, res, next) {
  var username = req.body.username;

  if (username == req.user.username) {
    return next(new HttpError(403,"Действие невозможно!"));
  }
  User.findOne({username: username},function (err, user) {
    if (err || !user ) {
      return next(new HttpError(403,"Действие невозможно!"));
    }
      Noted.find_noted(req.user.username, username, function (err, noted) {
        if (err) {
          if (err instanceof AuthError_let) {
            return next(new HttpError(403, err.message));
          } else {
              return next(err);
          }
          }
          if (noted) {
            return next(new HttpError(403,"Действие невозможно!"));
          }
          var err_status_low = 0;
          Noted.find_noteds(req.user.username, function (err, noteds) {
            if (err) {
              if (err instanceof AuthError_let) {
                return next(new HttpError(403, err.message));
              } else {
                  return next(err);
              }
              }
          if (noteds.length < 30) {
            var noted = new Noted({
              sender: req.user.username,
              recipient: username,
              created: new Date
            });
            noted.save(function (err) {
              if(err) return next(err);
            });
          } else {
            err_status_low = 1;
          }

          res.json(err_status_low);
        });
        });
    });

}
