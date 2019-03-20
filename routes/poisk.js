var HttpError = require('../error').HttpError;
var User = require('../models/user').User;
var AuthError = require('../models/user').AuthError;

exports.get = function (req, res, next) {
var err_message_low = '';
var poisk_find = 0;
var last_action = 0;
  res.render('poisk', { err_message_low: err_message_low, poisk_find: poisk_find, last_action: last_action });
};

exports.post = function (req, res, next) {
    var username= req.body.user;
if (username.length < 4 || username.length > 16) {
  username = '111';
}

    User.findOne({username: username},function (err, poisk_find) {
      if (err) {
        return next(new HttpError(403,"Действие невозможно!"));
      }
    var err_message_low = '';
    if (!poisk_find) {
      poisk_find = 0;
      err_message_low = 'Такого корсара не существует!';
    }

  res.render('poisk', { err_message_low: err_message_low, poisk_find: poisk_find.username,
                      last_action: poisk_find.last_action });
});
};
