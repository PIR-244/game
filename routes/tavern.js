var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var ship = require('../middleware/game/ship').list_ships;

exports.get = function (req, res,next) {
var err_message_low = '';
res.render('tavern', {err_message_low:err_message_low});
};

exports.post = function (req, res,next) {
  var buy_sell = req.body.buy_sell;
  var value_team = req.body.value_team;
  var number_team = req.body.number;
  var user_id = req.session.user;

  if (buy_sell == 'buy') {
  } else {
    buy_sell = 'sell';
  }
  if (value_team != 0 && value_team != 1 && value_team != 2) {
    value_team = 0;
  }
  if (number_team === undefined) {
    number_team = 0;
  }
  if (isNaN(number_team)) {
    number_team = 0;
  }
  if (number_team.length == 0) {
    number_team = 0;
  }
  if (+number_team > 0) { }
  else {
    number_team = 0;
  }
  number_team = Math.floor(number_team);
  var err_message_low = '';

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

      team = user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners;
      if (user.ship.plavanie == 0) {
        if (buy_sell == 'buy') {
          if (ship[user.ship.index_ship].team >= number_team + team) {
            if (ship[user.ship.index_ship].hold >= number_team + user.ship.hold) {
              if (value_team == 0 && number_team*12 <= user.pesos) {
                user.pesos = user.pesos - number_team*12;
                user.ship.team.sailors = user.ship.team.sailors + number_team;
                if (team == 0) user.ship.team.created = new Date;
              } else if (value_team == 1 && number_team*16 <= user.pesos) {
                user.pesos = user.pesos - number_team*16;
                user.ship.team.boarders = user.ship.team.boarders + number_team;
                if (team == 0) user.ship.team.created = new Date;
              } else if (value_team == 2 && number_team*18 <= user.pesos) {
                user.pesos = user.pesos - number_team*18;
                user.ship.team.gunners = user.ship.team.gunners + number_team;
                if (team == 0) user.ship.team.created = new Date;
              } else {
                err_message_low = 'Недостаточно песо для найма!';
              }
            } else {
              err_message_low = 'Корабль полон. Освободите трюм!';
            }
          } else {
            err_message_low = 'Максимально допустимое количество команды на корабле: '+ship[user.ship.index_ship].team;
          }
        } else {
          if (value_team == 0 && number_team <= user.ship.team.sailors) {
            user.ship.team.sailors = user.ship.team.sailors - number_team;
          } else if (value_team == 1 && number_team <= user.ship.team.boarders) {
            user.ship.team.boarders = user.ship.team.boarders - number_team;
          } else if (value_team == 2 && number_team <= user.ship.team.gunners) {
            user.ship.team.gunners = user.ship.team.gunners - number_team;
          } else {
            err_message_low = 'У вас нет столько матросов для увольнения';
          }
        }
      } else {
        err_message_low = 'Вы находитесь в плавании!';
      }
      var ship_update = require('../middleware/game/ship_update');
      ship_update.Ship_update(user);
      user.save(function (err) {
        if(err) return next(err);
    });
    res.locals.user = user;

res.render('tavern', {err_message_low:err_message_low});
    });
};
