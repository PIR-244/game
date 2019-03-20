var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var potions = require('../middleware/game/potions').potions;

exports.get = function (req, res, next) {
  var value_potion = req.query.value_potion;
  var number_potion = req.query.number_potion;


  if (value_potion === undefined) {
    value_potion = 0;
  }
  if (isNaN(value_potion)) {
    value_potion = 0;
  }
  if (value_potion != 0 && value_potion != 1 && value_potion != 2 && value_potion != 3) {
    value_potion = 0;
  }

  if (number_potion === undefined) {
    number_potion = 0;
  }
  if (isNaN(number_potion)) {
    number_potion = 0;
  }
  if (number_potion.length == 0) {
    number_potion = 0;
  }
  if (+number_potion > 0) { }
  else {
    number_potion = 0;
  }
  number_potion = Math.floor(number_potion);

var name_potion = '';

  if (value_potion == 0) {
    name_potion = 'Снадобье интеллекта';
  } else if (value_potion == 1) {
    name_potion = 'Бодрящий ром';
  } else if (value_potion == 2) {
    name_potion = 'Бутыль ремонтника';
  } else {
    name_potion = 'Напиток меткости';
  }

  res.render('alchimik_confirmation', {number_potion: number_potion, value_potion: value_potion,
                                  price: potions[value_potion].price_gold_bars*number_potion, name_potion: name_potion});
};

exports.post = function (req, res, next) {
  var user_id = req.session.user;
  var value_potion = req.body.value_potion;
  var number_potion = req.body.number_potion;


  if (value_potion === undefined) {
    value_potion = 0;
  }
  if (isNaN(value_potion)) {
    value_potion = 0;
  }
  if (value_potion != 0 && value_potion != 1 && value_potion != 2 && value_potion != 3) {
    value_potion = 0;
  }

  if (number_potion === undefined) {
    number_potion = 0;
  }
  if (isNaN(number_potion)) {
    number_potion = 0;
  }
  if (number_potion.length == 0) {
    number_potion = 0;
  }
  if (+number_potion > 0) { }
  else {
    number_potion = 0;
  }
  number_potion = Math.floor(number_potion);
var err_status_low = 0;

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

var price = potions[value_potion].price_gold_bars*number_potion;
      if (user.ship.plavanie == 0) {
        if (price <= user.gold_bars) {
          user.gold_bars = user.gold_bars - price;
          Object.keys(user.potions).forEach(function (key) {
            if (potions[value_potion].name_eng == key) {
              user.potions[key].number = user.potions[key].number + number_potion;

              // TRAINING
              if (user.training == 24) {
                if (key == 'invigorating_rum' && number_potion > 0) {
                  user.training++;
                }
              }

            }
          });
        } else { err_status_low = 1; }
      } else { err_status_low = 2; }


      user.save(function (err) {
        if(err) return next(err);
    });
        res.json(err_status_low);
      });
}
