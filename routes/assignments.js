 var shop = require('../middleware/game/shop').list_products;
var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var async = require('async');

exports.get = function (req, res, next) {
    res.render('assignments', {name_products: shop[req.user.assignments.shop.index_cargo].name,
                              number_products: Math.floor(req.user.assignments.shop.cargo/shop[req.user.assignments.shop.index_cargo].weight_pack*shop[req.user.assignments.shop.index_cargo].number_pack)});

};

exports.post = function (req, res, next) {
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
    if (user.ship.plavanie == 1) {
      return next(new HttpError(403,"Вы не можете брать задания, пока находитесь в плавании"));
    }
var activity_true = 0;
    async.each(Object.keys(user.assignments),function (assignments, callback) {
      if (user.assignments[assignments].activity == 1 || user.assignments[assignments].activity == 4) {
        activity_true = 1;
      }
    });
if(activity_true==0){
    async.each(Object.keys(user.assignments),function (assignments_value, callback) {
      if (assignments_value == value && user.assignments[assignments_value].activity == 0 || assignments_value == value && user.assignments[assignments_value].activity == 3) {
        user.assignments[assignments_value].activity += 1;

        // TRAINING
        if (user.training == 14) {
          if (value == 'tavern') {
            user.training++;
          }
        }

        if (value == 'shop') {
          var ship_update = require('../middleware/game/ship_update');
          ship_update.Ship_update(user);
        }
        user.save(function (err) {
          if(err) return next(err);
      });
      }
    });
}
else {
  async.each(Object.keys(user.assignments),function (assignments_value, callback) {
    if (assignments_value == value) {
      if (user.assignments[assignments_value].activity == 1 || user.assignments[assignments_value].activity == 4) {
          return next(new HttpError(300));
      }
      else {
        return next(new HttpError(403,"У вас уже есть активное задание"));
      }
    }
  });
}
        res.send();
});
}
