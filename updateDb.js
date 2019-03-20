var User = require('./models/user').User;
var mongoose = require('./libs/mongoose');
var async = require('async');

  setTimeout(function () {
  var rating_created = new Date;
mongoose.connection.once('open', function () {
  var timerId = setInterval(function () {
      User.find({online_day: 1},function (err, docs) {
        if (err) throw err;
        //              Изменение ОБЩЕГО РЕЙТИНГА
                var date_now = new Date;
                date_now = new Date(date_now - rating_created);
                if((((date_now.getFullYear()-1970)*365 + date_now.getMonth()*30 + (date_now.getDate()-1))*24 + (date_now.getHours()-3))*60 + date_now.getMinutes() >= 5){
                  var overal_rating = require('./middleware/game/overal_rating');
                  overal_rating.Overal_rating(docs);
                  rating_created = new Date;
                }
        //              Выборка контроля боя против противника
        var index_sender = [];
        var index_recipient = [];

        async.each(Object.keys(docs),function (user_index, callback) {
          var user = docs[user_index];

//              Выборка контроля боя против противника
          if (user.ship.plavanie == 1 && user.war.user_war.length >= 4 &&
               user.war.activity_war >= 2 && user.war.activity_war <= 6) {
                 var no_recipient = 0;
            for (var i = 0; i < index_recipient.length; i++) {
              if (docs[index_recipient[i]].username == user.username) {
                no_recipient = 1;
                break;
              }
            }
            if (no_recipient == 0) {
              var no_enemy = 1;
              for (var i = 0; i < docs.length; i++) {
                if (docs[i].username == user.war.user_war && docs[i].ship.plavanie == 1 && docs[i].war.user_war == user.username ) {
                  index_sender.push(user_index);
                  index_recipient.push(i);
                  no_enemy = 0;
                  break;
                }
              }
              if (no_enemy == 1) {
                  var Journal = require('./models/journal').Journal;
                  var LogWar = require('./models/logWar').LogWar;
                //    LogWar
                LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                    if (logWars[0]) {
                      for (var i = 0; i < logWars.length; i++) {
                        logWars[i].remove(function (err) {
                          if(err) throw err;
                        });
                      }
                    }
                  });
                  //    Journal
                  Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
                      if (journal) {
                        journal.remove(function (err) {
                          if(err) throw err;
                        });
                      }
                    });
                    user.war.activity_war = 0;
                    user.ship.plavanie = 0;
                    user.war.user_war = 0;
              }
            }
          }

//              Изменение ЗАДАНИЙ
            date_now = new Date;
          if ((date_now.getTime()-user.assignments.created.getTime())/(1000*60*60*24) >= 1 || user.assignments.index_ship != user.ship.index_ship) {
            var assignments = require('./middleware/game/assignments');
            assignments.Assignments_create(user);
          }

//             Изменение РЕЙТИНГА
date_now = new Date;
          if ((date_now.getTime()-user.rating.created.getTime())/(1000*60*60*24) >= 1) {
            var rating_update = require('./middleware/game/rating_update');
            rating_update.Rating_update(user);
          }

//            КОМАНДА ЕСТ и МРЕТ
          date_now = new Date;
          date_now = new Date(date_now - user.ship.team.created);
          if(((date_now.getFullYear()-1970)*365 + date_now.getMonth()*30 + (date_now.getDate()-1))*24 + (date_now.getHours()-3) >= 2 && user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners != 0){
            var team_eat = require('./middleware/game/team_eat');
            team_eat.Team_eat(user);
            var ship_update = require('./middleware/game/ship_update');
            ship_update.Ship_update(user);
          }

//              Ремонт КОРАБЛЯ
          date_now = new Date;
          date_now = new Date(date_now - user.ship.created);
          if((((date_now.getFullYear()-1970)*365 + date_now.getMonth()*30 + (date_now.getDate()-1))*24 + (date_now.getHours()-3))*60 + date_now.getMinutes() >= 5 && user.ship.plavanie == 0){
            var ship_repairs = require('./middleware/game/ship_repairs');
            ship_repairs.Ship_repairs(user);
            var ship_update = require('./middleware/game/ship_update');
            ship_update.Ship_update(user);
          }

//                КОНТРОЛЬ БОЯ
          if (user.ship.plavanie == 1 && user.war.user_war == 'bot' ||
              user.ship.plavanie == 1 && user.war.activity_war >= 0 && user.war.activity_war <= 1 ||
              user.ship.plavanie == 1 && user.war.activity_war == 6 && user.war.user_war == 0) {
            var date_now = new Date();
            if (date_now.getTime()/1000 >= user.last_action.getTime()/1000 + 360 ||
                date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + 360){
                var Journal = require('./models/journal').Journal;
                var LogWar = require('./models/logWar').LogWar;

              if (user.war.activity_war >= 1 && user.war.user_war == 'bot') {
                //    Journal
                Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
                    if (journal) {
                      journal.rating = 0;
                      journal.value_war = 3; // ничья
                      journal.number_one = -1;
                      journal.reward = -1;
                      journal.created = new Date;
                      journal.save(function (err) {
                        if(err) throw err;
                      });
                    }
                  });
              }
                if (user.war.activity_war >= 3 && user.war.user_war == 'bot') {
                  //    LogWar
                  LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                    if (!logWars[0]) {
                      logWars[0] = 0;
                    }
                    if (logWars.length < 5) {
                      var logWar = new LogWar({
                        sender: user.username,
                        recipient: user.war.user_war,
                        value_war: 3, // ничья
                        created: new Date
                      });
                      logWar.save(function (err) {
                        if(err) throw err;
                      });
                    } else {

                      var position = 0;
                      var logWars_poryadok = [];
                      var value_delete = 0;
                      for (var i = 0; i < logWars.length; i++) {
                        for (var j = 0; j < logWars_poryadok.length; j++) {
                            if (logWars_poryadok[j].created < logWars[i].created) {
                              position = j;
                              break;
                            }
                            if (j+1 == logWars_poryadok.length) {
                              value_delete = i;
                            }
                        }
                          logWars_poryadok.splice(position, 0, logWars[i]);
                          position=logWars_poryadok.length;
                      }

                      logWars[value_delete].sender = user.username;
                      logWars[value_delete].recipient = user.war.user_war;
                      logWars[value_delete].value_war = 3; // ничья
                      logWars[value_delete].created = new Date;
                      logWars[value_delete].save(function (err) {
                        if(err) throw err;
                      });

                    }
                    });
                }


              user.war.waiting = Math.floor(Math.random() * 15 + 23);
              user.war.last_action = new Date;
              user.war.activity_war = 6;
              user.war.reward = 0;
              user.last_action = new Date;

            } else {
              var battle_control = require('./middleware/game/battle_control');
              battle_control.Battle_control(user);
            }
          }



//                  БИТВА БОТОВ
          if (user.war.user_war == 'bot' && user.boti.war.activity_war >= 3 && user.boti.war.activity_war <= 4 &&
              user.war.activity_war >= 3 && user.war.activity_war <= 5) {
            var battle_bot = require('./middleware/game/battle_bot');
            battle_bot.Battle_bot(user);
          }

//                  ВЫПОЛНЕНИЕ ЗАДАНИЙ
          if (user.ship.plavanie == 2) {
            var assignments_control = require('./middleware/game/assignments_control');
            assignments_control.Assignments_control(user);
          }



          date_now = new Date;
           if ((date_now.getTime()-user.last_action.getTime())/(1000*60*60*24) >= 1) {
          user.online_day = 0;
          user.rating.rating = 0;
          }
          date_now = new Date(date_now - user.last_action);
          if ((((date_now.getFullYear()-1970)*365 + date_now.getMonth()*30 + (date_now.getDate()-1))*24 + (date_now.getHours()-3))*60 + date_now.getMinutes() >= 30) {
          user.online = 0;
          }
        user.save(function (err) {
          if (err) throw err;
        });
      });

      // Контроль битвы пользователей
      for (var i = 0; i < index_sender.length; i++) {
        var user = docs[index_sender[i]];
        var enemy = docs[index_recipient[i]];
        var enemy_battle_control = require('./middleware/game/enemy_battle_control');
        enemy_battle_control.Enemy_battle_control(user, enemy);
      }

    });
  }, 2000);
});
}, 1000);
