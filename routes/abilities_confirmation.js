var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var abilities = require('../middleware/game/abilities').abilities;

exports.get = function (req, res, next) {
  var value_abilities = req.query.value_abilities;
  var value_money = req.query.value_money;
  var number_abilities = req.query.number_abilities;

  if (value_abilities === undefined) {
    value_abilities = 'fast_recharge';
  }
  var act_val_abil = 0;
  Object.keys(req.user.abilities).forEach(function (key) {
    if (value_abilities == key) { act_val_abil = 1;}
  });
  if (act_val_abil == 0) {
    value_abilities = 'fast_recharge';
  }

  if (number_abilities === undefined) {
    number_abilities = 0;
  }
  if (isNaN(number_abilities)) {
    number_abilities = 0;
  }
  if (number_abilities.length == 0) {
    number_abilities = 0;
  }
  if (number_abilities != 0 && number_abilities != 1 && number_abilities != 2 && number_abilities != 3
      && number_abilities != 4) {
    number_abilities = 0;
  }
  var price = 0;
  if (value_money == 'point_rating') {
    price = abilities[value_abilities].price_point_rating[number_abilities] + ' очков рейтинга';
  }
  else {
    value_money = 'gold_bars';
    price = abilities[value_abilities].price_gold_bars[number_abilities] + ' золотых слитков';
  }

var name_abilities = abilities[value_abilities].name;

  res.render('abilities_confirmation', {number_abilities: number_abilities, value_abilities: value_abilities,
                                  price: price, name_abilities: name_abilities, value_money: value_money});
};

exports.post = function (req, res, next) {
  var user_id = req.session.user;
  var value_abilities = req.body.value_abilities;
  var value_money = req.body.value_money;
  var number_abilities = req.body.number_abilities;

  if (value_abilities === undefined) {
    value_abilities = 'fast_recharge';
  }
  var act_val_abil = 0;
  Object.keys(req.user.abilities).forEach(function (key) {
    if (value_abilities == key) { act_val_abil = 1;}
  });
  if (act_val_abil == 0) {
    value_abilities = 'fast_recharge';
  }

  if (number_abilities === undefined) {
    number_abilities = 0;
  }
  if (isNaN(number_abilities)) {
    number_abilities = 0;
  }
  if (number_abilities.length == 0) {
    number_abilities = 0;
  }
  if (number_abilities != 0 && number_abilities != 1 && number_abilities != 2 && number_abilities != 3
      && number_abilities != 4) {
    number_abilities = 0;
  }
  if (value_money == 'point_rating') { }
  else {
    value_money = 'gold_bars';
  }
var err_status_low = 0;

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

      if (user.ship.plavanie == 0) {
        if (user.abilities[value_abilities].level < +number_abilities+1) {
          if (value_money == 'point_rating') {
            if (user.point_rating >= abilities[value_abilities].price_point_rating[number_abilities]) {
             user.point_rating = user.point_rating - abilities[value_abilities].price_point_rating[number_abilities];
             user.abilities[value_abilities].level = +number_abilities+1;
             var act_val_abil = 0;
             Object.keys(user.abilities).forEach(function (key) {
               if (user.abilities[key].activity == 1) { act_val_abil++;}
             });
             if (act_val_abil < 3) {
               user.abilities[value_abilities].activity = 1;
             }
            } else { err_status_low = 2; }
          } else {
            if (user.gold_bars >= abilities[value_abilities].price_gold_bars[number_abilities]) {
             user.gold_bars = user.gold_bars - abilities[value_abilities].price_gold_bars[number_abilities];
             user.abilities[value_abilities].level = +number_abilities+1;
             var act_val_abil = 0;
             Object.keys(user.abilities).forEach(function (key) {
               if (user.abilities[key].activity == 1) { act_val_abil++;}
             });
             if (act_val_abil < 3) {
               user.abilities[value_abilities].activity = 1;
             }
           } else { err_status_low = 1; }
          }
          var ship_update = require('../middleware/game/ship_update');
          ship_update.Ship_update(user);
        } else { err_status_low = 3; }
      } else { err_status_low = 4; }
      user.save(function (err) {
        if(err) return next(err);
    });
        res.json(err_status_low);
      });
}
