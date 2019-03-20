var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var ship = require('../middleware/game/ship').list_ships;
var guns = require('../middleware/game/guns').list_guns;

exports.get = function (req, res, next) {
  var value_ships = req.query.value_ships;
  var url;

  if (value_ships === undefined) {
    value_ships = 0;
  }
  if (isNaN(value_ships)) {
    value_ships = 0;
  }
  if (value_ships != 0 && value_ships != 1 && value_ships != 2 && value_ships != 3 && value_ships != 4
       && value_ships != 5 && value_ships != 6 && value_ships != 7 && value_ships != 8
       && value_ships != 9 && value_ships != 10 && value_ships != 11 && value_ships != 12) {
    value_ships = 0;
  }
  if (value_ships >= 0 && value_ships <= 3) {
    url = '/verf/ships_light';
  } else if (value_ships >= 4 && value_ships <= 6) {
    url = '/verf/ships_5';
  } else if (value_ships >= 7 && value_ships <= 9) {
    url = '/verf/ships_4';
  } else {
    url = '/verf/ships_3';
  }

    res.render('ships_confirmation', {ship: ship[value_ships], value_ships: value_ships, url: url});
};

exports.post = function (req, res, next) {
  var url_ships = req.body.url;
  var value_ships = req.body.value_ships;
  var user_id = req.session.user;

  if (value_ships === undefined) {
    value_ships = 0;
  }
  if (isNaN(value_ships)) {
    value_ships = 0;
  }
  if (value_ships != 0 && value_ships != 1 && value_ships != 2 && value_ships != 3 && value_ships != 4
       && value_ships != 5 && value_ships != 6 && value_ships != 7 && value_ships != 8
       && value_ships != 9 && value_ships != 10 && value_ships != 11 && value_ships != 12) {
    value_ships = 0;
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

 var ship_buy = ship[value_ships];

      if (user.ship.plavanie == 0) {
        if (ship_buy.price <= user.pesos) {
          if (ship_buy.hold >= user.ship.hold) {
            if (value_ships != user.ship.index_ship) {
              if (user.bank.credit.number_credit == 0) {
                if (ship_buy.team >= user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners) {
                  if (ship_buy.guns.number_guns >= user.ship.guns.number_guns) {
                    if (ship_buy.guns.funt_guns >= guns[user.ship.guns.funt_guns].funt_guns) {
                      if (ship_buy.navigation <= user.skills.navigation) {
                        user.pesos = user.pesos - ship_buy.price;
                        user.ship.index_ship = value_ships;
                        user.ship.hull = ship_buy.hull;
                        user.ship.sails = ship_buy.sails;
                        var ship_update = require('../middleware/game/ship_update');
                        ship_update.Ship_update(user);

                        // TRAINING
                        if (user.training == 28) {
                          if (value_ships == 1) {
                            user.training++;
                          }
                        }

                          user.save(function (err) {
                            if(err) return next(err);
                        });
                      }  else { err_status_low=8; }
                    }  else { err_status_low=7; }
                  }  else { err_status_low=6; }
                }  else { err_status_low=5; }
              }  else { err_status_low=4; }
            }  else { err_status_low=3; }
        } else { err_status_low=2; }
      } else { err_status_low=1; }
    } else { err_status_low=9; }

        res.json(err_status_low);
      });
}
