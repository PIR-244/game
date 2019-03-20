var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var async = require('async');

exports.get = function (req, res) {
  res.render('login');
};

exports.post = function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if(username.length < 4 || username.length > 16 || password.length > 16 || password.length < 4)
    return next(new HttpError(403,"Логин или пароль введен неверено"));


  User.authorize(username, password, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
    }

    req.session.user = user._id;
    res.send();
  });

}
