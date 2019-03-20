var HttpError = require('../../error').HttpError;
var User = require('../../models/user').User;
var AuthError = require('../../models/user').AuthError;

exports.get = function (req, res, next) {
var err_message_low = '';
  res.render('./user/settings', { err_message_low: err_message_low });
};

exports.post = function (req, res, next) {
    var password = req.body.old;
    var new_par = req.body.new_par;
    var povtor_new_par = req.body.povtor_new_par;
    var user_id = req.session.user;
var err_message_low = '';

User.rename_password(user_id, password, new_par, povtor_new_par, function (err, user, err_message_low) {
  if (err) {
    if (err instanceof AuthError) {
      return next(new HttpError(403, err.message));
    } else {
        return next(err);
    }
    }

  res.render('./user/settings', { err_message_low: err_message_low });
});
};
