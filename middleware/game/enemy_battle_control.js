var experience = require('./experience').experience;
var User = require('../../models/user').User;
var Journal = require('../../models/journal').Journal;
var LogWar = require('../../models/logWar').LogWar;

module.exports.Enemy_battle_control = function (user, enemy) {
 var date_now = new Date();
 if (date_now.getTime()/1000 < user.last_action.getTime()/1000 + 360 &&
     date_now.getTime()/1000 < user.war.last_action.getTime()/1000 + 360 &&
     date_now.getTime()/1000 < enemy.last_action.getTime()/1000 + 360 &&
         date_now.getTime()/1000 < enemy.war.last_action.getTime()/1000 + 360) {

           //    Ожидание начала боя
 if (user.war.activity_war == 2 && date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting-1 ||
      enemy.war.activity_war == 2 && date_now.getTime()/1000 >= enemy.war.last_action.getTime()/1000 + enemy.war.waiting-1) {
        user.war.waiting = 120;
        user.war.last_action = new Date;
        user.war.activity_war = 3;
        user.save(function (err) {
          if (err) throw err;
        });
        enemy.war.waiting = 120;
        enemy.war.last_action = new Date;
        enemy.war.activity_war = 3;
        enemy.save(function (err) {
          if (err) throw err;
        });
        //    LogWar

              var logWar = new LogWar({
                sender: user.username,
                recipient: user.war.user_war,
                value_war: 5, // start battle
                created: new Date
              });
              logWar.save(function (err) {
                if(err) throw err;
              });
    } else if (user.war.activity_war == 3) { // battle
      if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting) {
               if (date_now.getTime()/1000 >= enemy.war.last_action.getTime()/1000 + enemy.war.waiting &&
                    enemy.war.activity_war == 3) {
                      user.war.waiting = Math.floor(Math.random() * 15 + 23);
                      user.war.last_action = new Date;
                      user.war.activity_war = 6;
                      user.war.reward = 0;
                      enemy.war.waiting = user.war.waiting;
                      enemy.war.last_action = new Date;
                      enemy.war.activity_war = 6;
                      enemy.war.reward = 0;
                      enemy.save(function (err) {
                        if (err) throw err;
                      });
               user.save(function (err) {
                 if (err) throw err;
               });
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

      }
    } else if (user.war.activity_war == 4) {   //  АБОРДАЖ
      if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting-1) {
        var boards_battle = require('./boards_battle');
        boards_battle.Enemy_boards_battle(user, enemy);
      } else { // КОНТРОЛЬ ОТМЕНЫ Абордажа

            if (user.ship.speed / enemy.ship.speed < 1.3) {
              user.war.waiting = 120;
              user.war.last_action = new Date;
              user.war.activity_war = 3;

              user.save(function (err) {
                if (err) throw err;
              });
            }
      }
    } else if (user.war.activity_war == 5) {   //    УПЛЫТИЕ
      if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting-1) {
        user.war.waiting = Math.floor(Math.random() * 15 + 23);
        user.war.activity_war = 6;
        user.war.reward = 0;
        user.war.last_action = new Date;
        var abilities_learn = 0;
        if (user.abilities.learnbility.activity == 1 && user.abilities.learnbility.level > 0) {
          var abilities = require('./abilities').abilities;
          abilities_learn = abilities.learnbility.levels_proc[user.abilities.learnbility.level]/100;
        }
        user.skills.number_navigation = user.skills.number_navigation +
                       Math.floor((1+abilities_learn) * experience[user.ship.index_ship].navigation*0.75);
        if (user.skills.number_navigation >= Math.floor(Math.pow(user.skills.navigation+1, 2.57))) {
          user.skills.number_navigation = user.skills.number_navigation -
                                       Math.floor(Math.pow(user.skills.navigation+1, 2.57));
          user.skills.navigation = user.skills.navigation + 1;
        }
            enemy.war.waiting = user.war.waiting;
            enemy.war.last_action = new Date;
            enemy.war.activity_war = 6;
            enemy.war.reward = 0;
            enemy.save(function (err) {
              if (err) throw err;
            });
            user.save(function (err) {
              if (err) throw err;
            });
        //    Journal
        Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
            if (journal) {
              journal.rating = 0;
              journal.value_war = 2; // уплытие
              if (journal.sender == user.username) {
                journal.number_one = 0;
              } else {
                journal.number_one = 1;
              }
              journal.reward = -1;
              journal.created = new Date;
              journal.save(function (err) {
                if(err) throw err;
              });
            }
          });
          //    LogWar
          LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
            if (!logWars[0]) {
              logWars[0] = 0;
            }
            if (logWars.length < 5) {
              var logWar = new LogWar({
                sender: user.username,
                recipient: user.war.user_war,
                value_war: 2, // away
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
              logWars[value_delete].value_war = 2; // away
              logWars[value_delete].created = new Date;
              logWars[value_delete].save(function (err) {
                if(err) throw err;
              });

            }
            });

      } else { // КОНТРОЛЬ ОТМЕНЫ УПЛЫТИЯ

            if (user.ship.speed / enemy.ship.speed < 1.3) {
              user.war.waiting = 120;
              user.war.last_action = new Date;
              user.war.activity_war = 3;

              user.save(function (err) {
                if (err) throw err;
              });
            }
        }

    } else if (user.war.activity_war == 6 && date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting ||
           enemy.war.activity_war == 6 && date_now.getTime()/1000 >= enemy.war.last_action.getTime()/1000 + enemy.war.waiting) {
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
        user.war.activity_war = 0;
        user.ship.plavanie = 0;
        user.war.user_war = 0;
        user.ship.created = new Date;
        user.save(function (err) {
          if (err) throw err;
        });
        enemy.war.activity_war = 0;
        enemy.ship.plavanie = 0;
        enemy.war.user_war = 0;
        enemy.ship.created = new Date;
        enemy.save(function (err) {
          if (err) throw err;
        });
    }
// Дела ПРОТИВНИКА
    if (enemy.war.activity_war == 4) {   //  АБОРДАЖ
      if (date_now.getTime()/1000 >= enemy.war.last_action.getTime()/1000 + enemy.war.waiting-1) {
        var boards_battle = require('./boards_battle');
        boards_battle.Enemy_boards_battle(enemy, user);
      } else { // КОНТРОЛЬ ОТМЕНЫ Абордажа

            if (enemy.ship.speed / user.ship.speed < 1.3) {
              enemy.war.waiting = 120;
              enemy.war.last_action = new Date;
              enemy.war.activity_war = 3;

              enemy.save(function (err) {
                if (err) throw err;
              });
            }
      }
    } else if (enemy.war.activity_war == 5) {   //    УПЛЫТИЕ
      if (date_now.getTime()/1000 >= enemy.war.last_action.getTime()/1000 + enemy.war.waiting-1) {
        enemy.war.waiting = Math.floor(Math.random() * 15 + 23);
        enemy.war.activity_war = 6;
        enemy.war.reward = 0;
        enemy.war.last_action = new Date;
        var abilities_learn = 0;
        if (enemy.abilities.learnbility.activity == 1 && enemy.abilities.learnbility.level > 0) {
          var abilities = require('./abilities').abilities;
          abilities_learn = abilities.learnbility.levels_proc[enemy.abilities.learnbility.level]/100;
        }
        enemy.skills.number_navigation = enemy.skills.number_navigation +
                       Math.floor((1+abilities_learn) * experience[enemy.ship.index_ship].navigation*0.75);
        if (enemy.skills.number_navigation >= Math.floor(Math.pow(enemy.skills.navigation+1, 2.57))) {
          enemy.skills.number_navigation = enemy.skills.number_navigation -
                                       Math.floor(Math.pow(enemy.skills.navigation+1, 2.57));
          enemy.skills.navigation = enemy.skills.navigation + 1;
        }
            user.war.waiting = enemy.war.waiting;
            user.war.last_action = new Date;
            user.war.activity_war = 6;
            user.war.reward = 0;
            user.save(function (err) {
              if (err) throw err;
            });
            enemy.save(function (err) {
              if (err) throw err;
            });
        //    Journal
        Journal.find_journal(enemy.username, enemy.war.user_war, function (err, journal) {
            if (journal) {
              journal.rating = 0;
              journal.value_war = 2; // уплытие
              if (journal.sender == enemy.username) {
                journal.number_one = 0;
              } else {
                journal.number_one = 1;
              }
              journal.reward = -1;
              journal.created = new Date;
              journal.save(function (err) {
                if(err) throw err;
              });
            }
          });
          //    LogWar
          LogWar.find_logs(enemy.username, enemy.war.user_war, function (err, logWars) {
            if (!logWars[0]) {
              logWars[0] = 0;
            }
            if (logWars.length < 5) {
              var logWar = new LogWar({
                sender: enemy.username,
                recipient: enemy.war.user_war,
                value_war: 2, // away
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

              logWars[value_delete].sender = enemy.username;
              logWars[value_delete].recipient = enemy.war.user_war;
              logWars[value_delete].value_war = 2; // away
              logWars[value_delete].created = new Date;
              logWars[value_delete].save(function (err) {
                if(err) throw err;
              });

            }
            });

      } else { // КОНТРОЛЬ ОТМЕНЫ УПЛЫТИЯ

            if (enemy.ship.speed / user.ship.speed < 1.3) {
              enemy.war.waiting = 120;
              enemy.war.last_action = new Date;
              enemy.war.activity_war = 3;

              enemy.save(function (err) {
                if (err) throw err;
              });
            }
        }

    }

    //   TIME END
 } else {
       enemy.war.waiting = Math.floor(Math.random() * 15 + 23);
       enemy.war.last_action = new Date;
       enemy.war.activity_war = 6;
       enemy.war.reward = 0;
       enemy.last_action = new Date;
       enemy.save(function (err) {
         if (err) throw err;
       });
     user.war.waiting = enemy.war.waiting;
     user.war.last_action = new Date;
     user.war.activity_war = 6;
     user.war.reward = 0;
     user.last_action = new Date;
     user.save(function (err) {
       if (err) throw err;
     });

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
   //    LogWar
   LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
     if (err) throw err;
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

}
