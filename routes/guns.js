var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var ship = require('../middleware/game/ship').list_ships;
var guns = require('../middleware/game/guns').list_guns;

exports.get = function (req, res,next) {
var err_message_low = '';
res.render('guns', {guns:guns, err_message_low:err_message_low});
};

exports.post = function (req, res,next) {
  var buy_sell = req.body.buy_sell;
  var value_guns = req.body.value_guns;
  var number_guns = req.body.number;
  var user_id = req.session.user;

  if (buy_sell == 'buy') {
  } else {
    buy_sell = 'sell';
  }
  if (value_guns != 0 && value_guns != 1 && value_guns != 2 && value_guns != 3) {
    value_guns = 0;
  }
  if (number_guns === undefined) {
    number_guns = 0;
  }
  if (isNaN(number_guns)) {
    number_guns = 0;
  }
  if (number_guns.length == 0) {
    number_guns = 0;
  }
  if (+number_guns > 0) { }
  else {
    number_guns = 0;
  }
  number_guns = Math.floor(number_guns);
  var err_message_low = '';

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

      if (user.ship.plavanie == 0) {
        if (buy_sell == 'buy') {
          if (value_guns == user.ship.guns.funt_guns || user.ship.guns.number_guns == 0) {
            if (ship[user.ship.index_ship].hold >= number_guns*guns[value_guns].weight + user.ship.hold) {
              if (ship[user.ship.index_ship].guns.number_guns >= user.ship.guns.number_guns + number_guns) {
                if (ship[user.ship.index_ship].guns.funt_guns >= guns[value_guns].funt_guns) {
                  if (number_guns*guns[value_guns].price <= user.pesos) {
                    if (user.ship.guns.number_guns == 0) {
                      user.ship.guns.funt_guns = value_guns;
                    }
                    user.pesos = user.pesos - number_guns*guns[value_guns].price;
                    user.ship.guns.number_guns = user.ship.guns.number_guns + number_guns;
                  } else {
                    err_message_low = 'Недостаточно песо для покупки орудий!';
                  }
                } else {
                  err_message_low = 'На ваш корабль можно установить пушки до '+ship[user.ship.index_ship].guns.funt_guns+' фунтов!';
                }
              } else {
                err_message_low = 'Максимально можно установить орудий на корабль: '+ship[user.ship.index_ship].guns.number_guns;
              }
            } else {
              err_message_low = 'Корабль полон. Освободите трюм!';
            }
          } else {
            err_message_low = 'Нельзя на корабль устанавливать орудия разных калибров!';
          }
        } else {
          if (number_guns <= user.ship.guns.number_guns && value_guns == user.ship.guns.funt_guns) {
            user.ship.guns.number_guns = user.ship.guns.number_guns - number_guns;
            user.pesos = user.pesos + number_guns*guns[value_guns].sale;
          } else if (number_guns == 0) {

          } else {
            err_message_low = 'У вас нет столько орудий для продажи!';
          }
        }
      }else {
        err_message_low = 'Вы находитесь в плавании!';
      }

      var ship_update = require('../middleware/game/ship_update');
      ship_update.Ship_update(user);
      user.save(function (err) {
        if(err) return next(err);
    });
    res.locals.user = user;

res.render('guns', {guns:guns, err_message_low:err_message_low});
    });
};
