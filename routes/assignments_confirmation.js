var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var async = require('async');

exports.post = function (req, res,next) {

  var value = req.body.value;
  var user_id = req.session.user;

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
    }
  async.each(Object.keys(user.assignments),function (assignments_value, callback) {
      if (user.assignments[assignments_value].activity == 1 || user.assignments[assignments_value].activity == 4) {
        if(value == 'yes')
        {
          user.assignments[assignments_value].activity += 1;
          if (assignments_value == 'shop') {
            var ship_update = require('../middleware/game/ship_update');
            ship_update.Ship_update(user);
          }
          if (user.assignments[assignments_value].activity == 2 && assignments_value != 'residence') {
            var assign_one = require('../middleware/game/assign_one');
            assign_one.Assign_one(user, assignments_value);
          }
          user.save(function (err) {
            if(err) return next(err);
            });
          }
    }
  });

        res.send();
  });

};
exports.get = function (req, res,next) {

res.render('assignments_confirmation');
};
