var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var shop = require('../middleware/game/shop').list_products;
var ship = require('../middleware/game/ship').list_ships;

exports.get = function (req, res, next) {
  var buy_sell = req.query.buy_sell;
  var value_products = req.query.value_products;
  var number_products = req.query.number;

  if (buy_sell === undefined) {
    buy_sell == 'sell';
  }
  if (value_products === undefined) {
    value_products = 0;
  }
  if (isNaN(value_products)) {
    value_products = 0;
  }
  if (number_products === undefined) {
    number_products = 0;
  }
  if (isNaN(number_products)) {
    number_products = 0;
  }

  if (number_products.length == 0) {
    number_products = 0;
  }
  if (+number_products > 0) { }
  else {
    number_products = 0;
  }
  number_products = Math.floor(number_products);
  var price;
  var buy_sell_rus;
  if (buy_sell == 'buy') {
  price = shop[value_products].price;
  buy_sell_rus = 'купить';
  }
  else {
    buy_sell == 'sell';
    buy_sell_rus = 'продать';
    price = shop[value_products].sell;
  }
  if (value_products != 0 && value_products != 1 && value_products != 2 && value_products != 3 && value_products != 4
       && value_products != 5 && value_products != 6 && value_products != 7) {
    value_products = 0;
  }

    res.render('shop_confirmation', {number_products: number_products, buy_sell: buy_sell, price: price,
                 value_products: value_products, buy_sell_rus: buy_sell_rus,
                product_name: shop[value_products].name, number_pack: shop[value_products].number_pack});
};

exports.post = function (req, res, next) {
  var buy_sell = req.body.buy_sell;
  var value_products = req.body.value_products;
  var number_products = req.body.number_products;
  var user_id = req.session.user;
  if (buy_sell === undefined) {
    buy_sell == 'sell';
  }
  if (value_products === undefined) {
    value_products = 0;
  }
  if (isNaN(value_products)) {
    value_products = 0;
  }
  if (number_products === undefined) {
    number_products = 0;
  }
  if (isNaN(number_products)) {
    number_products = 0;
  }
  if (number_products.length == 0) {
    number_products = 0;
  }
  if (+number_products > 0) { }
  else {
    number_products = 0;
  }
  number_products = Math.floor(number_products);
  var price;
  if (buy_sell == 'buy') {
  price = shop[value_products].price;
  }
  else {
    buy_sell == 'sell';
    price = shop[value_products].sell;
  }
  if (value_products != 0 && value_products != 1 && value_products != 2 && value_products != 3 && value_products != 4
       && value_products != 5 && value_products != 6 && value_products != 7) {
    value_products = 0;
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
 price = price * number_products;
 var number_products_pack = number_products * shop[value_products].number_pack;

      if (user.ship.plavanie == 0) {
        if (buy_sell == 'buy') {
          if (price <= user.pesos) {

          if (ship[user.ship.index_ship].hold - user.ship.hold >= number_products * shop[value_products].weight_pack) {

          user.pesos = user.pesos - price;
          Object.keys(user.ship.supplies).forEach(function (key) {
            if (shop[value_products].name_eng == key) {
              user.ship.supplies[key] = user.ship.supplies[key] + number_products_pack;

              // TRAINING
              if (user.training == 2) {
                if (key == 'bombs') {
                  if (user.ship.supplies.bombs >= 80 || number_products_pack >= 50) {
                    user.training++;
                    if (user.ship.guns.charge == 3) {
                      user.training++;
                    }
                  }
                }
              }

            }
          });
        } else {
          err_status_low=2;
        }
        } else {
          err_status_low=1;
        }
        } else {
          Object.keys(user.ship.supplies).forEach(function (key) {
            if (shop[value_products].name_eng == key) {
              if (user.ship.supplies[key] >= number_products_pack) {

              user.pesos = user.pesos + price;
              user.ship.supplies[key] = user.ship.supplies[key] - number_products_pack;
            } else {
              err_status_low=3;
            }
            }
          });
        }
      }else {
        err_status_low=4;
      }
      var ship_update = require('../middleware/game/ship_update');
      ship_update.Ship_update(user);
      user.save(function (err) {
        if(err) return next(err);
    });
        res.json(err_status_low);
      });
}
