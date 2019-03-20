var Noted = require('../../models/noted').Noted;
var mongoose = require('../../libs/mongoose');
var AuthError_not = require('../../models/noted').AuthError_not;
var HttpError = require('../../error').HttpError;

exports.get = function (req, res, next) {
  var page = req.query.page;
  var username = req.query.user;
  if (page == 3) {
    page = 3;
  } else if (page == 2) {
    page = 2;
  } else {
    page = 1;
  }

  if (username == req.user.username) {
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
        if (!noted) {
          return next(new HttpError(403,"Действие невозможно!"));
        }

    res.render('./pochta/noted_confirmation', {page: page, username: username});
  });
};



exports.post = function (req, res, next) {
  var username = req.body.username;

  if (username == req.user.username) {
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
          if (!noted) {
            return next(new HttpError(403,"Действие невозможно!"));
          }
          noted.remove(function (err) {
            if(err) return next(err);
          });
          res.send();
    });

}
