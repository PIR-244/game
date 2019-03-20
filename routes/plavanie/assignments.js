var User = require('../../models/user').User;
var HttpError = require('../../error').HttpError;
var AuthError = require('../../models/user').AuthError;
var async = require('async');
var AuthError_journal = require('../../models/journal').AuthError_journal;
var Journal = require('../../models/journal').Journal;

exports.get = function (req, res,next) {
  async.waterfall([
      function(callback){
        //    Journal
        if (req.user.war.activity_war == 4 &&  req.user.ship.plavanie == 2) {
          Journal.find({ sender: { $in: [req.user.username, 'ass']}, recipient: { $in: [ req.user.username, 'ass' ]}, rating: { $ne: -1 }}, function (err, journals) {
            if (err) {
              if (err instanceof AuthError_journal) {
                return next(new HttpError(403, err.message));
              } else {
                  return next(err);
              }
              }
              if (journals[0]) {
                var info_war = null;
                for (var i = 0; i < journals.length; i++) {
                  var date_now = new Date;
                      if (date_now.getTime()/1000 < journals[i].created.getTime()/1000+360 && journals[i].value_war >= 5 && journals[i].value_war <= 6) {
                          info_war = journals[i];
                      }
                  }
                  callback(null, info_war);
                } else {
                  callback(null, null);
                }
            });
        } else {
          callback(null, null);
        }
    }
  ], function (err, info_war) {
    var err_message_low = '';
    var url = 'poiskAss';
      if (req.user.war.activity_war == 1) {
        url = 'waiting_confirmationAss';
      } else if (req.user.war.activity_war == 2) {
        url = 'delivery_cargo';
      } else if (req.user.war.activity_war == 3) {
        url = 'passenger_transporation';
      } else if (req.user.war.activity_war == 4) {
        res.locals.info_war = null;
        if (info_war) {
          res.locals.info_war = info_war;
        }
      url = 'return_homeAss';
      }
      else if (req.user.ship.plavanie != 2) {
      url = 'plavanie';
    }

    res.render('./plavanie/'+url, {err_message_low:err_message_low});
  });

};

exports.post = function (req, res,next) {
  var err_message_low = '';
  var user_id = req.session.user;

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

          if (user.ship.plavanie == 0) {
           var ship = require('../../middleware/game/ship').list_ships;
            var matros_team = user.ship.team.sailors*3 + user.ship.team.boarders + user.ship.team.gunners;
            if (ship[user.ship.index_ship].hull*0.3 <= user.ship.hull &&
                ship[user.ship.index_ship].sails*0.3 <= user.ship.sails &&
                ship[user.ship.index_ship].team*0.1*3 <= matros_team) {

              user.war.last_action = new Date;
              var assignments_value = req.body.assignments;
              if (assignments_value == 'shop') {
                if (user.assignments.shop.activity == 1 || user.assignments.shop.activity == 4) {
                  user.ship.plavanie = 2;
		  user.war.activity_war = 2;
                  user.war.waiting = Math.floor(Math.random() * 150 + 240);
                  res.locals.plavanie_message = 8;
                }
              } else if (assignments_value == 'tavern') {
                if (user.assignments.tavern.activity == 1 || user.assignments.tavern.activity == 4) {
                  user.war.activity_war = 3;
		  user.ship.plavanie = 2;
                  user.war.waiting = Math.floor(Math.random() * 150 + 240);
                  res.locals.plavanie_message = 9;

                  // TRAINING
                  if (user.training == 18) {
                    user.training++;
                  }

                }
              } else if (assignments_value == 'residence') {
                if (user.assignments.residence.activity == 1) {
		  user.ship.plavanie = 2;
                  user.war.activity_war = 0;
                  user.war.waiting = Math.floor(Math.random() * 128 + 120);
                  res.locals.plavanie_message = 6;
                }
              }
            } else {
              err_message_low = 'Твой корабль не готов выйти в открытое море.';
            }
          }
          else if (user.ship.plavanie == 2) {
            if (user.war.activity_war == 0) { // ПОИСК ПИРАТА
              var away_value = req.body.away;
              if (away_value == 0) {
                var date_now = new Date;
                user.war.waiting = Math.ceil(date_now.getTime()/1000 - user.war.last_action.getTime()/1000);
                if (user.war.waiting > 40) {
                  user.war.waiting = Math.floor(Math.random() * 15 + 23);
                }
                user.war.activity_war = 4;
                user.war.last_action = new Date;
                res.locals.plavanie_message = 10;
              }
            }
            else if (user.war.activity_war == 1) { // ОЖИДАНИЕ ПОДТВЕРЖДЕНИЯ
              var away_value = req.body.away;
              if (away_value == 0) {
                user.ship.plavanie = 1;
                user.war.activity_war = 2;
                user.war.waiting = 10;
                user.war.last_action = new Date;
                res.locals.plavanie_message = 3;
              } else if (away_value == 1) {
                  user.war.waiting = Math.floor(Math.random() * 15 + 23);
                user.war.activity_war = 4;
                user.war.last_action = new Date;
                res.locals.plavanie_message = 10;
                //    Journal
                Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
                    if (journal) {
                      journal.remove(function (err) {
                        if(err) throw err;
                      });
                    }
                  });
              }
            }
            else if (user.war.activity_war == 2) { // ДОСТАВКА ГРУЗА
              var away_value = req.body.away;
              if (away_value == 0) {
                var date_now = new Date;
                user.war.waiting = Math.ceil(date_now.getTime()/1000 - user.war.last_action.getTime()/1000);
                user.war.activity_war = 4;
                user.war.last_action = new Date;
                res.locals.plavanie_message = 10;
              }
            }
            else if (user.war.activity_war == 3) { // ПЕРЕВОЗКА ПАССАЖИРОВ
              var away_value = req.body.away;
              if (away_value == 0) {
                var date_now = new Date;
                user.war.waiting = Math.ceil(date_now.getTime()/1000 - user.war.last_action.getTime()/1000);
                user.war.activity_war = 4;
                user.war.last_action = new Date;
                res.locals.plavanie_message = 10;
              }
            }
          }

         user.save(function (err) {
           if(err) return next(err);
       });

        async.waterfall([
            function(callback){
              //    Journal
              if (user.war.activity_war == 4 &&  user.ship.plavanie == 2) {
                Journal.find({ sender: { $in: [req.user.username, 'ass']}, recipient: { $in: [ req.user.username, 'ass' ]}, rating: { $ne: -1 }}, function (err, journals) {
                  if (err) {
                    if (err instanceof AuthError_journal) {
                      return next(new HttpError(403, err.message));
                    } else {
                        return next(err);
                    }
                    }
                    if (journals[0]) {
                      var info_war = null;
                      for (var i = 0; i < journals.length; i++) {
                        var date_now = new Date;
                            if (date_now.getTime()/1000 < journals[i].created.getTime()/1000+120 && journals[i].value_war >= 5 && journals[i].value_war <= 6) {
                                info_war = journals[i];
                            }
                        }
                        callback(null, info_war);
                      } else {
                        callback(null, null);
                      }
                  });
              } else {
                callback(null, null);
              }
          }
        ], function (err, info_war) {
          var url = 'poiskAss';
            if (user.war.activity_war == 1) {
              url = 'waiting_confirmationAss';
            } else if (user.war.activity_war == 2) {
              url = 'delivery_cargo';
            } else if (user.war.activity_war == 3) {
              url = 'passenger_transporation';
            } else if (user.war.activity_war == 4) {
              res.locals.info_war = null;
              if (info_war) {
                res.locals.info_war = info_war;
              }
            url = 'return_homeAss';
            }
            else if (user.ship.plavanie != 2) {
              if (user.ship.plavanie == 1 && user.war.activity_war == 2) {
              res.locals.enemy_name = null;
              res.locals.enemy_avatar = null;
              res.locals.hull_enemy = null;
              res.locals.sails_enemy = null;
              res.locals.team_enemy = null;
              res.locals.speed_enemy = null;
              res.locals.mobility_enemy = null;
              if (req.user.war.user_war == 'bot') {
                res.locals.enemy_name = user.boti.username;
                res.locals.enemy_avatar = user.boti.avatar_index;
                res.locals.hull_enemy = user.boti.ship.hull;
                res.locals.sails_enemy = user.boti.ship.sails;
                res.locals.team_enemy = user.boti.ship.team.sailors +
                       user.boti.ship.team.boarders + user.boti.ship.team.gunners;
                res.locals.speed_enemy = user.boti.ship.speed;
                res.locals.mobility_enemy = user.boti.ship.mobility;
              }
                url = 'waiting_battle';
              } else {
                url = 'plavanie';
              }
          }

          user.last_action = new Date;
          res.locals.user = user;
          res.render('./plavanie/'+url, {err_message_low:err_message_low});
        });
      });
}
