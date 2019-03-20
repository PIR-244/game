var potions = require('./potions').potions;
var ship = require('./ship').list_ships;
var abilities = require('./abilities').abilities;
var User = require('../../models/user').User;
var experience = require('./experience').experience;
var Journal = require('../../models/journal').Journal;
var LogWar = require('../../models/logWar').LogWar;

module.exports.Boards_battle = function (user) {

  var boti = require('./boti').bots_standart;
  var value_battle;
  var team = user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners;
    var bot_team = user.boti.ship.team.sailors + user.boti.ship.team.boarders
                            + user.boti.ship.team.gunners;
    var damage_userM = 0;
    if (user.abilities.musket_volley.activity == 1 && user.abilities.musket_volley.level > 0) {
      var number_rip = Math.round(abilities.musket_volley.levels_proc[user.abilities.musket_volley.level]/100
                            *bot_team);
      if (number_rip > team) {   number_rip = team; }
      damage_userM = number_rip;
      var rip;
      while (number_rip > 0) {
        rip = Math.floor(Math.random() * 3 + 1);
        if(rip == 1)  {
          if(user.boti.ship.team.sailors != 0) {
            user.boti.ship.team.sailors = user.boti.ship.team.sailors - 1;
            number_rip--;
          }
        }
        if(rip == 2)  {
          if(user.boti.ship.team.boarders != 0){
            user.boti.ship.team.boarders = user.boti.ship.team.boarders - 1;
            number_rip--;
          }
        }
        if(rip == 3)  {
          if(user.boti.ship.team.gunners != 0) {
            user.boti.ship.team.gunners = user.boti.ship.team.gunners - 1;
            number_rip--;
          }
        }
      }
    }
    if (damage_userM > 0) {
    //    LogWar
    LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
      if (!logWars[0]) {
        logWars[0] = 0;
      }
      var date_now = new Date
      if (logWars.length < 5) {
        var logWar = new LogWar({
          sender: user.username,
          recipient: user.war.user_war,
          damage_one: damage_userM,
          damage_two: 0,
          value_war: 4, // мушкетный залп
          created: new Date(date_now.getTime()-2000)
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
        logWars[value_delete].damage_one = damage_userM,
        logWars[value_delete].value_war = 4; // мушкетный залп
        logWars[value_delete].created = new Date(date_now.getTime()-2000);
        logWars[value_delete].save(function (err) {
          if(err) throw err;
        });

      }
      });
    }

    //         Расчет абордажа персонажа
      var team_weapons = user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners;
      var team_board = user.ship.team.sailors + user.ship.team.boarders*3 + user.ship.team.gunners;
      if (team_weapons > user.ship.supplies.weapons) {  //  Нехватка оружия
        team_weapons = user.ship.supplies.weapons;
        if (user.ship.team.boarders > team_weapons) {
          team_board = (user.ship.team.sailors + user.ship.team.gunners)/3 + (user.ship.team.boarders
            - team_weapons) + (user.ship.team.boarders-(user.ship.team.boarders - team_weapons))*3;
        } else {
          team_board = team_board - ((user.ship.team.sailors + user.ship.team.gunners) -
              (team_weapons - user.ship.team.boarders))*0.666;
        }
      }
      var date_now = new Date;
      var value_potion = 0;
      if (date_now <= user.potions.invigorating_rum.created) {
        value_potion = 0.5;
      }
      team_board = team_board + team_board*(user.skills.boarding + user.skills.boarding*value_potion) / 100;
      var value_abilities = 0;
      if (user.abilities.masters_boarding.activity == 1 && user.abilities.masters_boarding.level > 0) {
        value_abilities =
            abilities.masters_boarding.levels_proc[user.abilities.masters_boarding.level]/100;
      }

      team_board = team_board + team_board*value_abilities;

      //         Расчет абордажа БОТА
        var bot_team_weapons = user.boti.ship.team.sailors + user.boti.ship.team.boarders + user.boti.ship.team.gunners;
        var bot_team_board = user.boti.ship.team.sailors + user.boti.ship.team.boarders*3 + user.boti.ship.team.gunners;
        if (bot_team_weapons > user.boti.ship.supplies.weapons) {  //  Нехватка оружия
          bot_team_weapons = user.boti.ship.supplies.weapons;
          if (user.boti.ship.team.boarders > bot_team_weapons) {
            bot_team_board = (user.boti.ship.team.sailors + user.boti.ship.team.gunners)/3 + (user.boti.ship.team.boarders
            - bot_team_weapons) + (user.boti.ship.team.boarders-(user.boti.ship.team.boarders - bot_team_weapons))*3;
          } else {
            bot_team_board = bot_team_board - ((user.boti.ship.team.sailors + user.boti.ship.team.gunners) -
                (bot_team_weapons - user.boti.ship.team.boarders))*0.666;
          }
        }

        bot_team_board = bot_team_board + bot_team_board*user.boti.skills.boarding / 100;
        bot_team_board = bot_team_board + bot_team_board*0.225;


     //  Сам Абордаж
     var number_round = 8;
     var ostalos_team_board = team_board;
     var part_team_board = ostalos_team_board / number_round;
     ostalos_team_board=0;
     var ostalos_bot_team_board = bot_team_board;
     var bot_part_team_board = ostalos_bot_team_board / number_round;
     ostalos_bot_team_board=0;
     var proc = part_team_board / (part_team_board + bot_part_team_board);
     var delete_weapons = 0;
        for (var i = 0; i < 4; i++) {
          for (var j = 0; j < number_round; j++) {
            value_battle = (Math.random() * 100)/100;
            if (proc > value_battle) {
              ostalos_team_board = ostalos_team_board + part_team_board;
            } else {
              ostalos_bot_team_board = ostalos_bot_team_board + bot_part_team_board;
            }
          }
          delete_weapons += Math.random() * 7 + 3;
          if (ostalos_team_board == 0 || ostalos_bot_team_board == 0) {
            break;
          }
          number_round=number_round/2;
          part_team_board = ostalos_team_board / number_round;
          ostalos_team_board=0;
          bot_part_team_board = ostalos_bot_team_board / number_round;
          ostalos_bot_team_board=0;
          proc = part_team_board / (part_team_board + bot_part_team_board);
        }

        //         Подсчет убитых и итог
        if (ostalos_bot_team_board == 0) {
          // residence_true
          if (user.assignments.residence.activity == 1 && user.boti.username == user.assignments.residence.name_pirates) {
            user.assignments.residence.activity = 2;
            user.gold_bars = user.gold_bars + user.assignments.residence.reward;
            user.rating.number_rating = user.rating.number_rating + 2;
            //    Journal
              Journal.find_journals(user.username, function (err, journals) {
                  if (!journals[0]) {
                    journals[0] = 0;
                  }
                  var name_true = user.boti.username;
                  if (journals.length < 100) {
                    var journal = new Journal({
                      sender: user.username,
                      recipient: user.war.user_war,
                      value_war: 4, // residence_true
                      number_one: 0,
                      reward: user.assignments.residence.reward,
                      rating: 2,
                      bot_name: name_true,
                      created: new Date(date_now.getTime()+1000)
                    });
                    journal.save(function (err) {
                      if(err) throw err;
                    });
                  } else {

                    var position = 0;
                    var journals_poryadok = [];
                    var value_delete = 0;
                    for (var i = 0; i < journals.length; i++) {
                      for (var j = 0; j < journals_poryadok.length; j++) {
                          if (journals_poryadok[j].created < journals[i].created) {
                            position = j;
                            break;
                          }
                          if (j+1 == journals_poryadok.length) {
                            value_delete = i;
                          }
                      }
                        journals_poryadok.splice(position, 0, journals[i]);
                        position=journals_poryadok.length;
                    }

                    journal[value_delete].sender = user.username;
                    journal[value_delete].recipient = user.war.user_war;
                    journal[value_delete].value_war = 4; // residence_true
                    journal[value_delete].number_one = 0;
                    journal[value_delete].reward = user.assignments.residence.reward;
                    journal[value_delete].rating = 2;
                    journal[value_delete].bot_name = name_true;
                    logWars[value_delete].created = new Date(date_now.getTime()+1000);
                    journals[value_delete].save(function (err) {
                      if(err) throw err;
                    });

                  }
                });
          }
          var delete_team_enemy = user.boti.ship.team.sailors + user.boti.ship.team.boarders + user.boti.ship.team.gunners;
          user.boti.ship.team.sailors = 0;
          user.boti.ship.team.boarders = 0;
          user.boti.ship.team.gunners = 0;

          // TRAINING
          if (user.training == 26) {
            user.training++;
          }

          var ostalos_team = ostalos_team_board/team_board;
          team = user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners;
          ostalos_team = Math.floor(ostalos_team * team);
          var rip_team = team - ostalos_team;
          if (rip_team > team) {
            rip_team = team;
          }
          var delete_team_user = rip_team;
          var team_res = 0;
          if (rip_team > 0 && user.ship.supplies.drugs > 0) {
            var treatment_board = require('./treatment_board');
            var rip_team1 = treatment_board.Treatment_board(rip_team, user);
            team_res = rip_team - rip_team1;
            rip_team = rip_team1;
          }
          var rip;
          while (rip_team > 0) {
            rip = Math.floor(Math.random() * 3 + 1);
            if(rip == 1)  {
              if(user.ship.team.sailors != 0) {
                user.ship.team.sailors = user.ship.team.sailors - 1;
                rip_team--;
              }
            }
            if(rip == 2)  {
              if(user.ship.team.boarders != 0){
                user.ship.team.boarders = user.ship.team.boarders - 1;
                rip_team--;
              }
            }
            if(rip == 3)  {
              if(user.ship.team.gunners != 0) {
                user.ship.team.gunners = user.ship.team.gunners - 1;
                rip_team--;
              }
            }
          }
          user.war.reward = Math.floor(Math.random() * ((boti[user.boti.ship.index_ship].reward)*0.6)
           + (boti[user.boti.ship.index_ship].reward*0.7));
          user.statistics.victories = user.statistics.victories + 1;
          user.statistics.robbed = user.statistics.robbed + user.war.reward;
          var rating_win = 0;
          if (user.war.enemy_value == 1) {
            rating_win = 1;
          } else if (user.war.enemy_value == 2) {
            rating_win = 2;
          }
          user.rating.number_rating = user.rating.number_rating + rating_win;
          user.pesos = user.pesos + user.war.reward;
          //    Journal
          Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
              if (journal) {
                journal.rating = rating_win;
                journal.value_war = 1; // board
                journal.number_one = 0;
                journal.reward = user.war.reward;
                journal.created = new Date;
                journal.save(function (err) {
                  if(err) return next(err);
                });
                user.save(function (err) {
                  if (err) throw err;
                });
              }
            });
            //    LogWar
            LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
              if (!logWars[0]) {
                logWars[0] = 0;
              }
              if (delete_team_enemy > 0) {
                delete_team_enemy = Math.round(delete_team_enemy*10 - 5 + Math.floor(Math.random() * 10));
              }
              if (delete_team_user > 0) {
                delete_team_user = Math.round(delete_team_user*10 - 5 + Math.floor(Math.random() * 10));
              }
              if (logWars.length < 5) {
                var logWar = new LogWar({
                  sender: user.username,
                  recipient: user.war.user_war,
                  damage_one: delete_team_enemy,
                  damage_two: delete_team_user,
                  team_res: team_res,
                  value_war: 1, // board
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
                logWars[value_delete].damage_one = delete_team_enemy,
                logWars[value_delete].damage_two = delete_team_user,
                logWars[value_delete].team_res = team_res,
                logWars[value_delete].value_war = 1; // board
                logWars[value_delete].created = new Date;
                logWars[value_delete].save(function (err) {
                  if(err) throw err;
                });

              }
              });
        }
        else {
          var delete_team_user = user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners;
          user.ship.team.sailors = 0;
          user.ship.team.boarders = 0;
          user.ship.team.gunners = 0;
          var ostalos_team = ostalos_bot_team_board/bot_team_board;
          team = user.boti.ship.team.sailors + user.boti.ship.team.boarders + user.boti.ship.team.gunners;
          ostalos_team = Math.floor(ostalos_team * team);
          var rip_team = team - ostalos_team;
          if (rip_team > team) {
            rip_team = team;
          }
          var delete_team_enemy = rip_team;
          user.war.reward = -user.pesos;
          user.statistics.defeats = user.statistics.defeats + 1;
          user.statistics.lost = user.statistics.lost + user.pesos;
          user.pesos = 0;
          user.ship.hull = 1;
          user.ship.sails = 0;
          var rating_lose = 0;
          if (user.war.enemy_value == 0) {
            rating_lose = 1;
          }
          if (user.rating.number_rating > 0) {
            user.rating.number_rating = user.rating.number_rating - rating_lose;
          }
          //    Journal
          Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
              if (journal) {
                rating_win = 0;
                if (user.war.enemy_value == 0) {
                  rating_win = 2;
                }
                journal.rating = rating_win;
                journal.value_war = 1; // board
                journal.number_one = 1;
                journal.reward = -user.war.reward;
                journal.created = new Date;
                journal.save(function (err) {
                  if(err) return next(err);
                });
                user.save(function (err) {
                  if (err) throw err;
                });
              }
            });
            //    LogWar
            LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
              if (!logWars[0]) {
                logWars[0] = 0;
              }
              if (delete_team_enemy > 0) {
                delete_team_enemy = Math.round(delete_team_enemy*10 - 5 + Math.floor(Math.random() * 10));
              }
              if (delete_team_user > 0) {
                delete_team_user = Math.round(delete_team_user*10 - 5 + Math.floor(Math.random() * 10));
              }
              if (logWars.length < 5) {
                var logWar = new LogWar({
                  sender: user.war.user_war,
                  recipient: user.username,
                  damage_one: delete_team_user,
                  damage_two: delete_team_enemy,
                  value_war: 1, // board
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

                logWars[value_delete].sender = user.war.user_war;
                logWars[value_delete].recipient = user.username;
                logWars[value_delete].damage_one = delete_team_user,
                logWars[value_delete].damage_two = delete_team_enemy,
                logWars[value_delete].value_war = 1; // board
                logWars[value_delete].created = new Date;
                logWars[value_delete].save(function (err) {
                  if(err) throw err;
                });

              }
              });

        }
        delete_weapons = Math.floor(team_weapons * delete_weapons/100);
        if (delete_weapons > user.ship.supplies.weapons) {
          delete_weapons = user.ship.supplies.weapons;
        }
        user.ship.supplies.weapons = user.ship.supplies.weapons - delete_weapons;
        user.war.waiting = Math.floor(Math.random() * 15 + 23);;
        user.war.activity_war = 6;
        user.war.last_action = new Date;
        var abilities_learn = 0;
        if (user.abilities.learnbility.activity == 1 && user.abilities.learnbility.level > 0) {
          abilities_learn = abilities.learnbility.levels_proc[user.abilities.learnbility.level]/100;
        }
        user.skills.number_boarding = user.skills.number_boarding + Math.floor((1+abilities_learn) *
                                      experience[user.ship.index_ship].boarding);
        if (user.skills.number_boarding >= Math.floor(Math.pow(user.skills.boarding+1, 2.64))) {
          user.skills.number_boarding = user.skills.number_boarding -
                                       Math.floor(Math.pow(user.skills.boarding+1, 2.64));
          user.skills.boarding = user.skills.boarding + 1;
        }

}


/*Object.keys(user.boti.abilities).forEach(function (key) {
  if (user.boti.abilities[key].name == 'musket_volley' && user.boti.abilities[key].level > 0) {
    var number_rip = abilities.musket_volley.levels_proc[user.boti.abilities[key].level]/100
                          *team;
    if (number_rip > bot_team) {   number_rip = bot_team; }
    var rip;
    while (number_rip > 0) {
      rip = Math.floor(Math.random() * 3 + 1);
      if(rip == 1)  {
        if(user.ship.team.sailors != 0) {
          user.ship.team.sailors = user.ship.team.sailors - 1;
          number_rip--;
        }
      }
      if(rip == 2)  {
        if(user.ship.team.boarders != 0){
          user.ship.team.boarders = user.ship.team.boarders - 1;
          number_rip--;
        }
      }
      if(rip == 3)  {
        if(user.ship.team.gunners != 0) {
          user.ship.team.gunners = user.ship.team.gunners - 1;
          number_rip--;
        }
      }
    }
  }
});*/

/*        Object.keys(user.boti.abilities).forEach(function (key) {
          if (user.boti.abilities[key].name == 'masters_boarding' && user.boti.abilities[key].level>0) {
            bot_team_board = bot_team_board + bot_team_board*
                abilities.masters_boarding.levels_proc[user.boti.abilities[key].level]/100;
          }
        });*/

module.exports.Enemy_boards_battle = function (user, enemy) {

      /////////     РАСЧЕТ ПРОТИВ ЮЗЕРА

        // / Мушетный залп персонажа
        var enemy_team = enemy.ship.team.sailors + enemy.ship.team.boarders
                                + enemy.ship.team.gunners;
      /* Стреляют одновременно поэтому перерасчета команды противника не будет*/
      var damage_userM = 0;
        if (user.abilities.musket_volley.activity == 1 && user.abilities.musket_volley.level > 0) {
          var number_rip = Math.round(abilities.musket_volley.levels_proc[user.abilities.musket_volley.level] /
                            100*enemy_team);
          if (number_rip > team) {   number_rip = team; }
          damage_userM = number_rip;
          var rip;
          while (number_rip > 0) {
            rip = Math.floor(Math.random() * 3 + 1);
            if(rip == 1)  {
              if(enemy.ship.team.sailors != 0) {
                enemy.ship.team.sailors = enemy.ship.team.sailors - 1;
                number_rip--;
              }
            }
            if(rip == 2)  {
              if(enemy.ship.team.boarders != 0){
                enemy.ship.team.boarders = enemy.ship.team.boarders - 1;
                number_rip--;
              }
            }
            if(rip == 3)  {
              if(enemy.ship.team.gunners != 0) {
                enemy.ship.team.gunners = enemy.ship.team.gunners - 1;
                number_rip--;
              }
            }
          }
        }
        // / Мушетный залп Противника
        var damage_enemyM = 0;
        if (enemy.abilities.musket_volley.activity == 1 && enemy.abilities.musket_volley.level > 0) {
          var number_rip = Math.round(abilities.musket_volley.levels_proc[enemy.abilities.musket_volley.level] /
                          100*team);
          if (number_rip > enemy_team) {   number_rip = enemy_team; }
          damage_enemyM = number_rip;
          var rip;
          while (number_rip > 0) {
            rip = Math.floor(Math.random() * 3 + 1);
            if(rip == 1)  {
              if(user.ship.team.sailors != 0) {
                user.ship.team.sailors = user.ship.team.sailors - 1;
                number_rip--;
              }
            }
            if(rip == 2)  {
              if(user.ship.team.boarders != 0){
                user.ship.team.boarders = user.ship.team.boarders - 1;
                number_rip--;
              }
            }
            if(rip == 3)  {
              if(user.ship.team.gunners != 0) {
                user.ship.team.gunners = user.ship.team.gunners - 1;
                number_rip--;
              }
            }
          }
        }
        if (damage_userM > 0 || damage_enemyM > 0) {
          //    LogWar
          LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
            if (!logWars[0]) {
              logWars[0] = 0;
            }
            var date_now = new Date
            if (logWars.length < 5) {
              var logWar = new LogWar({
                sender: user.username,
                recipient: user.war.user_war,
                damage_one: damage_userM,
                damage_two: damage_enemyM,
                value_war: 4, // мушкетный залп
                created: new Date(date_now.getTime()-2000)
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
              logWars[value_delete].damage_one = damage_userM,
              logWars[value_delete].damage_two = damage_enemyM,
              logWars[value_delete].value_war = 4; // мушкетный залп
              logWars[value_delete].created = new Date(date_now.getTime()-2000);
              logWars[value_delete].save(function (err) {
                if(err) throw err;
              });

            }
            });
        }

        //         Расчет абордажа персонажа
          var team_weapons = user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners;
          var team_board = user.ship.team.sailors + user.ship.team.boarders*3 + user.ship.team.gunners;
          if (team_weapons > user.ship.supplies.weapons) {  //  Нехватка оружия
            team_weapons = user.ship.supplies.weapons;
            if (user.ship.team.boarders > team_weapons) {
              team_board = (user.ship.team.sailors + user.ship.team.gunners)/3 + (user.ship.team.boarders
                - team_weapons) + (user.ship.team.boarders-(user.ship.team.boarders - team_weapons))*3;
            } else {
              team_board = team_board - ((user.ship.team.sailors + user.ship.team.gunners) -
                  (team_weapons - user.ship.team.boarders))*0.666;
            }
          }

          var date_now = new Date;
          var value_potion = 0;
          if (date_now <= user.potions.invigorating_rum.created) {
            value_potion = 0.5;
          }
          team_board = team_board + team_board*(user.skills.boarding + user.skills.boarding*value_potion) / 100;
          var value_abilities = 0;
          if (user.abilities.masters_boarding.activity == 1 && user.abilities.masters_boarding.level > 0) {
            value_abilities =
                abilities.masters_boarding.levels_proc[user.abilities.masters_boarding.level]/100;
          }

          team_board = team_board + team_board*value_abilities;

          //         Расчет абордажа Противника
            var enemy_team_weapons = enemy.ship.team.sailors + enemy.ship.team.boarders + enemy.ship.team.gunners;
            var enemy_team_board = enemy.ship.team.sailors + enemy.ship.team.boarders*3 + enemy.ship.team.gunners;
            if (enemy_team_weapons > enemy.ship.supplies.weapons) {  //  Нехватка оружия
              enemy_team_weapons = enemy.ship.supplies.weapons;
              if (enemy.ship.team.boarders > enemy_team_weapons) {
                enemy_team_board = (enemy.ship.team.sailors + enemy.ship.team.gunners)/3 + (enemy.ship.team.boarders -
                      enemy_team_weapons) + enemy_team_weapons*3;
              } else {
                enemy_team_board = enemy_team_board - ((enemy.ship.team.sailors + enemy.ship.team.gunners) -
                    (enemy_team_weapons - enemy.ship.team.boarders))*0.666;
              }
            }
            var date_now = new Date;
            var value_potion = 0;
            if (date_now <= enemy.potions.invigorating_rum.created) {
              value_potion = 0.5;
            }
            enemy_team_board = enemy_team_board + enemy_team_board*(enemy.skills.boarding + enemy.skills.boarding*value_potion) / 100;
            var value_abilities = 0;
            if (enemy.abilities.masters_boarding.activity == 1 && enemy.abilities.masters_boarding.level > 0) {
              value_abilities =
                  abilities.masters_boarding.levels_proc[enemy.abilities.masters_boarding.level]/100;
            }

            enemy_team_board = enemy_team_board + enemy_team_board*value_abilities;
            enemy_team_board = enemy_team_board + enemy_team_board*0.225;

            //  Сам Абордаж
            var number_round = 8;
            var ostalos_team_board = team_board;
            var part_team_board = ostalos_team_board / number_round;
            ostalos_team_board=0;
            var ostalos_enemy_team_board = enemy_team_board;
            var enemy_part_team_board = ostalos_enemy_team_board / number_round;
            ostalos_enemy_team_board=0;
            var proc = part_team_board / (part_team_board + enemy_part_team_board);
            var delete_weapons = 0;
            var enemy_delete_weapons = 0;
               for (var i = 0; i < 4; i++) {
                 for (var j = 0; j < number_round; j++) {
                   value_battle = (Math.random() * 100)/100;
                   if (proc > value_battle) {
                     ostalos_team_board = ostalos_team_board + part_team_board;
                   } else {
                     ostalos_enemy_team_board = ostalos_enemy_team_board + enemy_part_team_board;
                   }
                 }
                 delete_weapons += Math.random() * 7 + 3;
                 enemy_delete_weapons += Math.random() * 7 + 3;
                 if (ostalos_team_board == 0 || ostalos_enemy_team_board == 0) {
                   break;
                 }
                 number_round=number_round/2;
                 part_team_board = ostalos_team_board / number_round;
                 ostalos_team_board=0;
                 enemy_part_team_board = ostalos_enemy_team_board / number_round;
                 ostalos_enemy_team_board=0;
                 proc = part_team_board / (part_team_board + enemy_part_team_board);
               }

               //         Подсчет убитых и итог
               // Выиграл персонаж
               if (ostalos_enemy_team_board == 0) {
                 var delete_team_enemy = enemy.ship.team.sailors + enemy.ship.team.boarders + enemy.ship.team.gunners;
                 enemy.ship.team.sailors = 0;
                 enemy.ship.team.boarders = 0;
                 enemy.ship.team.gunners = 0;
                 enemy.war.reward = -enemy.pesos;
                 enemy.statistics.defeats = enemy.statistics.defeats + 1;
                 enemy.statistics.lost = enemy.statistics.lost + enemy.pesos;
                 enemy.ship.hull = 1;
                 enemy.ship.sails = 0;
                 var rating_lose = 0;
                 if (enemy.war.enemy_value == 0) {
                   rating_lose = 1;
                 }
                 if (enemy.rating.number_rating > 0) {
                   enemy.rating.number_rating = enemy.rating.number_rating - rating_lose;
                 }

                 var ostalos_team = ostalos_team_board/team_board;
                 team = user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners;
                 ostalos_team = Math.round(ostalos_team * team);
                 var rip_team = team - ostalos_team;
                 if (rip_team > team) {
                   rip_team = team;
                 }
                 var delete_team_user = rip_team;
                 var team_res = 0;
                 if (rip_team > 0 && user.ship.supplies.drugs > 0) {
                   var treatment_board = require('./treatment_board');
                   var rip_team1 = treatment_board.Treatment_board(rip_team, user);
                   team_res = rip_team - rip_team1;
                   rip_team = rip_team1;
                 }
                 var rip;
                 while (rip_team > 0) {
                   rip = Math.floor(Math.random() * 3 + 1);
                   if(rip == 1)  {
                     if(user.ship.team.sailors != 0) {
                       user.ship.team.sailors = user.ship.team.sailors - 1;
                       rip_team--;
                     }
                   }
                   if(rip == 2)  {
                     if(user.ship.team.boarders != 0){
                       user.ship.team.boarders = user.ship.team.boarders - 1;
                       rip_team--;
                     }
                   }
                   if(rip == 3)  {
                     if(user.ship.team.gunners != 0) {
                       user.ship.team.gunners = user.ship.team.gunners - 1;
                       rip_team--;
                     }
                   }
                 }
                 user.war.reward = enemy.pesos;
                 user.statistics.victories = user.statistics.victories + 1;
                 user.statistics.robbed = user.statistics.robbed + user.war.reward;
                 var rating_win = 0;
                 if (user.war.enemy_value == 1) {
                   rating_win = 1;
                 } else if (user.war.enemy_value == 2) {
                   rating_win = 2;
                 }
                 user.rating.number_rating = user.rating.number_rating + rating_win;
                 user.pesos = user.pesos + user.war.reward;
                 enemy.pesos = 0;
                 //    Journal
                 Journal.find_journal(user.username, enemy.username, function (err, journal) {
                     if (journal) {
                       journal.rating = rating_win;
                       journal.value_war = 1; // board
                       if (journal.sender == user.username) {
                         journal.number_one = 0;
                       } else {
                         journal.number_one = 1;
                       }
                       journal.reward = user.war.reward;
                       journal.created = new Date;
                       journal.save(function (err) {
                         if(err) return next(err);
                       });
                       user.save(function (err) {
                         if (err) throw err;
                       });
                     }
                   });
                   //    LogWar
                   LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                     if (!logWars[0]) {
                       logWars[0] = 0;
                     }
                     if (delete_team_enemy > 0) {
                       delete_team_enemy = Math.round(delete_team_enemy*10 - 5 + Math.floor(Math.random() * 10));
                     }
                     if (delete_team_user > 0) {
                       delete_team_user = Math.round(delete_team_user*10 - 5 + Math.floor(Math.random() * 10));
                     }
                     if (logWars.length < 5) {
                       var logWar = new LogWar({
                         sender: user.username,
                         recipient: user.war.user_war,
                         damage_one: delete_team_enemy,
                         damage_two: delete_team_user,
                         team_res: team_res,
                         value_war: 1, // board
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
                       logWars[value_delete].damage_one = delete_team_enemy,
                       logWars[value_delete].damage_two = delete_team_user,
                       logWars[value_delete].team_res = team_res,
                       logWars[value_delete].value_war = 1; // board
                       logWars[value_delete].created = new Date;
                       logWars[value_delete].save(function (err) {
                         if(err) throw err;
                       });

                     }
                     });
               }
               // Выиграл противник
               else {
                 var delete_team_user = user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners;
                 user.ship.team.sailors = 0;
                 user.ship.team.boarders = 0;
                 user.ship.team.gunners = 0;
                 user.war.reward = -user.pesos;
                 user.statistics.defeats = user.statistics.defeats + 1;
                 user.statistics.lost = user.statistics.lost + user.pesos;
                 user.ship.hull = 1;
                 user.ship.sails = 0;
                 var rating_lose = 0;
                 if (user.war.enemy_value == 0) {
                   rating_lose = 1;
                 }
                 if (user.rating.number_rating > 0) {
                   user.rating.number_rating = user.rating.number_rating - rating_lose;
                 }

                 var ostalos_enemy_team = ostalos_enemy_team_board/enemy_team_board;
                 team = enemy.ship.team.sailors + enemy.ship.team.boarders + enemy.ship.team.gunners;
                 ostalos_enemy_team = Math.round(ostalos_enemy_team * team);
                 var rip_team = team - ostalos_enemy_team;
                 if (rip_team > team) {
                   rip_team = team;
                 }
                 var delete_team_enemy = rip_team;
                 var team_res = 0;
                 if (rip_team > 0 && enemy.ship.supplies.drugs > 0) {
                   var treatment_board = require('./treatment_board');
                   var rip_team1 = treatment_board.Treatment_board(rip_team, enemy);
                   team_res = rip_team - rip_team1;
                   rip_team = rip_team1;
                 }
                 var rip;
                 while (rip_team > 0) {
                   rip = Math.floor(Math.random() * 3 + 1);
                   if(rip == 1)  {
                     if(enemy.ship.team.sailors != 0) {
                       enemy.ship.team.sailors = enemy.ship.team.sailors - 1;
                       rip_team--;
                     }
                   }
                   if(rip == 2)  {
                     if(enemy.ship.team.boarders != 0){
                       enemy.ship.team.boarders = enemy.ship.team.boarders - 1;
                       rip_team--;
                     }
                   }
                   if(rip == 3)  {
                     if(enemy.ship.team.gunners != 0) {
                       enemy.ship.team.gunners = enemy.ship.team.gunners - 1;
                       rip_team--;
                     }
                   }
                 }
                 enemy.war.reward = user.pesos;
                 enemy.statistics.victories = enemy.statistics.victories + 1;
                 enemy.statistics.robbed = enemy.statistics.robbed + enemy.war.reward;
                 var rating_win = 0;
                 if (enemy.war.enemy_value == 1) {
                   rating_win = 1;
                 } else if (enemy.war.enemy_value == 2) {
                   rating_win = 2;
                 }
                 enemy.rating.number_rating = enemy.rating.number_rating + rating_win;
                 enemy.pesos = enemy.pesos + enemy.war.reward;
                 user.pesos = 0;
                 //    Journal
                 Journal.find_journal(user.username, enemy.username, function (err, journal) {
                     if (journal) {
                       journal.rating = rating_win;
                       journal.value_war = 1; // board
                       if (journal.sender == enemy.username) {
                         journal.number_one = 0;
                       } else {
                         journal.number_one = 1;
                       }
                       journal.reward = enemy.war.reward;
                       journal.created = new Date;
                       journal.save(function (err) {
                         if(err) return next(err);
                       });
                       user.save(function (err) {
                         if (err) throw err;
                       });
                     }
                   });
                   //    LogWar
                   LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                     if (!logWars[0]) {
                       logWars[0] = 0;
                     }
                     if (delete_team_enemy > 0) {
                       delete_team_enemy = Math.round(delete_team_enemy*10 - 5 + Math.floor(Math.random() * 10));
                     }
                     if (delete_team_user > 0) {
                       delete_team_user = Math.round(delete_team_user*10 - 5 + Math.floor(Math.random() * 10));
                     }
                     if (logWars.length < 5) {
                       var logWar = new LogWar({
                         sender: user.war.user_war,
                         recipient: user.username,
                         damage_one: delete_team_user,
                         damage_two: delete_team_enemy,
                         team_res: team_res,
                         value_war: 1, // board
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

                       logWars[value_delete].sender = user.war.user_war;
                       logWars[value_delete].recipient = user.username;
                       logWars[value_delete].damage_one = delete_team_user,
                       logWars[value_delete].damage_two = delete_team_enemy,
                       logWars[value_delete].team_res = team_res,
                       logWars[value_delete].value_war = 1; // board
                       logWars[value_delete].created = new Date;
                       logWars[value_delete].save(function (err) {
                         if(err) throw err;
                       });

                     }
                     });
               }
               delete_weapons = Math.floor(team_weapons * delete_weapons/100);
               if (delete_weapons > user.ship.supplies.weapons) {
                 delete_weapons = user.ship.supplies.weapons;
               }
               user.ship.supplies.weapons = user.ship.supplies.weapons - delete_weapons;

               enemy_delete_weapons = Math.floor(enemy_team_weapons * enemy_delete_weapons/100);
               if (enemy_delete_weapons > enemy.ship.supplies.weapons) {
                 enemy_delete_weapons = enemy.ship.supplies.weapons;
               }
               enemy.ship.supplies.weapons = enemy.ship.supplies.weapons - enemy_delete_weapons;
        enemy.war.waiting = Math.floor(Math.random() * 15 + 23);
        enemy.war.last_action = new Date;
        enemy.war.activity_war = 6;
        var abilities_learn = 0;
        if (enemy.abilities.learnbility.activity == 1 && enemy.abilities.learnbility.level > 0) {
          abilities_learn = abilities.learnbility.levels_proc[enemy.abilities.learnbility.level]/100;
        }
        enemy.skills.number_boarding = enemy.skills.number_boarding + Math.floor((1+abilities_learn) *
                                      experience[enemy.ship.index_ship].boarding);
        if (enemy.skills.number_boarding >= Math.floor(Math.pow(enemy.skills.boarding+1, 2.64))) {
          enemy.skills.number_boarding = enemy.skills.number_boarding -
                                       Math.floor(Math.pow(enemy.skills.boarding+1, 2.64));
          enemy.skills.boarding = enemy.skills.boarding + 1;
        }
        user.war.waiting = enemy.war.waiting;
        user.war.activity_war = 6;
        user.war.last_action = new Date;

        abilities_learn = 0;
        if (user.abilities.learnbility.activity == 1 && user.abilities.learnbility.level > 0) {
          abilities_learn = abilities.learnbility.levels_proc[user.abilities.learnbility.level]/100;
        }
        user.skills.number_boarding = user.skills.number_boarding + Math.floor((1+abilities_learn) *
                                      experience[user.ship.index_ship].boarding);
        if (user.skills.number_boarding >= Math.floor(Math.pow(user.skills.boarding+1, 2.64))) {
          user.skills.number_boarding = user.skills.number_boarding -
                                       Math.floor(Math.pow(user.skills.boarding+1, 2.64));
          user.skills.boarding = user.skills.boarding + 1;
        }
        var ship_update = require('./ship_update');
        ship_update.Ship_update(enemy);
        enemy.save(function (err) {
          if (err) throw err;
        });
        ship_update.Ship_update(user);
      user.save(function (err) {
        if (err) throw err;
      });
}
