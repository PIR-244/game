var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var async = require('async');

exports.get = function (req, res) {
  res.render('registration');
};

exports.post = function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  if(username.length > 16)
    return next(new HttpError(403,"Логин слишком длинный"));
  if(username.length < 4)
      return next(new HttpError(403,"Логин слишком короткий"));
  if(password.length > 16)
      return next(new HttpError(403,"Пароль слишком длинный"));
  if(password.length < 4)
      return next(new HttpError(403,"Пароль слишком короткий"));

  for (var i = 0; i < username.length; i++) {
    var uniCode = username.charCodeAt(i);
    if(uniCode < 45 || uniCode == 47 || uniCode > 57 && uniCode < 65
      || uniCode > 90 && uniCode < 95 || uniCode == 96 || uniCode > 122 && uniCode < 1025
      || uniCode > 1025 && uniCode < 1040 || uniCode > 1103 && uniCode < 1105 || uniCode > 1105)
        return next(new HttpError(403,"Данные введены некорректно"));
  }



  User.registration(username, password, function (err, user) {
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
