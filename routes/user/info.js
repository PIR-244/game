var User = require('../../models/user').User;
var HttpError = require('../../error').HttpError;
var AuthError = require('../../models/user').AuthError;
var ship = require('../../middleware/game/ship').list_ships;
var Noted = require('../../models/noted').Noted;
var AuthError_not = require('../../models/noted').AuthError_not;

exports.get = function (req, res, next) {
var username = req.query.user;
var info = req.query.info;
var err_status_low = req.query.err_status_low;
var err_message_low = '';
if (err_status_low != 1) {
  err_status_low = 0;
} else {
  err_message_low = 'Превышен лимит отмеченных!';
}
if (info != 'skills' && info != 'statistics') {
  info = 0;
}
User.findOne({username: username},function (err, user) {
  if (err || !user ) {
    return next(new HttpError(403,"Действие невозможно!"));
  }

  Noted.find_noted(req.user.username, user.username, function (err, noted) {
    if (err) {
      if (err instanceof AuthError_let) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }
      var value_noted = 0;
      if (noted) {
        value_noted = 1;
      }
      if (req.user.username == user.username) {
        value_noted = 2;
      }


  res.render('./user/info', { username: user.username, last_action: user.last_action, ship_name: ship[user.ship.index_ship].name,
     navigation: user.skills.navigation, rating: user.rating.rating, skills: user.skills, err_message_low: err_message_low,
    statistics: user.statistics, value_noted: value_noted, info: info, avatar_index: user.avatar_index,
    err_status_low: err_status_low });
  });
});
};
