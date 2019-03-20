var experience = require('./experience').experience;
var User = require('../../models/user').User;
var Journal = require('../../models/journal').Journal;
var LogWar = require('../../models/logWar').LogWar;

module.exports.Battle_bot = function (user) {
 var date_now = new Date();

 if (user.boti.war.activity_war == 3) {

   // zalp
   var guns = require('./guns').list_guns;
    var ship = require('./ship').list_ships;
   var sek_time_recharge = guns[user.boti.ship.guns.funt_guns].recharge;
   var team = user.boti.ship.team.sailors + user.boti.ship.team.boarders + user.boti.ship.team.gunners*3;
   var chance_explosion =  guns[user.boti.ship.guns.funt_guns].chance_explosion;
   if (Math.ceil(ship[user.boti.ship.index_ship].team*0.2*3) > team) {
     var proc = Math.ceil(ship[user.boti.ship.index_ship].team*0.2*3)/team;
     if (proc>10) {
       proc = 10;
     }
     sek_time_recharge = sek_time_recharge*proc;
     chance_explosion = chance_explosion*proc;
   } else {
     team = team - Math.ceil(ship[user.boti.ship.index_ship].team*0.2*3);
     if (team > Math.ceil(ship[user.boti.ship.index_ship].team*0.5*3)) {
       team = Math.ceil(ship[user.boti.ship.index_ship].team*0.5*3);
     }
     var proc = team/Math.ceil(ship[user.boti.ship.index_ship].team*0.5*3);
     sek_time_recharge = Math.ceil(sek_time_recharge/2 + ((1-proc)*sek_time_recharge)/2);
     chance_explosion = Math.ceil((1-proc)*chance_explosion);
   }
   if (user.boti.war.last_recharge.getTime()/1000 + sek_time_recharge <= date_now.getTime()/1000) {
     if (user.boti.ship.guns.number_guns > 0) {
       var charge = 'core';
       if (user.boti.ship.guns.charge == 1) {
         charge = 'buckshot';
       } else if (user.boti.ship.guns.charge == 2) {
         charge = 'barshots';
       } else if (user.boti.ship.guns.charge == 3) {
         charge = 'bombs';
       }
       if (user.boti.ship.supplies[charge] > 0) {
         if (user.boti.ship.supplies.gunpowder > 0) {
           var guns_number = user.boti.ship.guns.number_guns;
           if (user.boti.ship.supplies[charge] < guns_number) {
             guns_number = user.boti.ship.supplies[charge];
           }
           if (user.boti.ship.supplies.gunpowder < guns_number) {
             guns_number = user.boti.ship.supplies.gunpowder;
           }
           user.boti.ship.supplies.gunpowder = user.boti.ship.supplies.gunpowder - guns_number;
           user.boti.ship.supplies[charge] = user.boti.ship.supplies[charge] - guns_number;
           var guns_delete = 0;
           for (var i = 0; i < guns_number; i++) {
             var chance = Math.random() * 100;
             if (chance_explosion >= chance) {
               guns_delete++;
             }
           }
           user.boti.ship.guns.number_guns = user.boti.ship.guns.number_guns - guns_delete;
           user.boti.war.last_recharge = new Date();
           user.boti.war.last_action = new Date;
           var boti_update = require('./boti_update');
           boti_update.Boti_update(user.boti);
	   var abilities = require('./abilities').abilities;

           // РАСЧЕТ УРОНА
           var accuracy = (guns[user.boti.ship.guns.funt_guns].accuracy/
                (guns[user.boti.ship.guns.funt_guns].accuracy+(user.ship.mobility/user.boti.ship.mobility)))*100;
           var guns_hit = 0;
           for (var i = 0; i < guns_number; i++) {
             var chance = Math.random() * 100;
             if (accuracy >= chance) {
               guns_hit++;
             }
           }
           var damage_hull = 3;
           var damage_sails = 3;
           var damage_team = 3;
           if (user.boti.ship.guns.charge == 1) {
             damage_hull = 1;
             damage_sails = 1;
             damage_team = 10;
           } else if (user.boti.ship.guns.charge == 2) {
             damage_hull = 1;
             damage_sails = 10;
             damage_team = 1;
           } else if (user.boti.ship.guns.charge == 3) {
             damage_hull = 10;
             damage_sails = 2;
             damage_team = 2;
           }
           var abilities_learn = 0;
           if (user.abilities.learnbility.activity == 1 && user.abilities.learnbility.level > 0) {
             abilities_learn = abilities.learnbility.levels_proc[user.abilities.learnbility.level]/100;
           }
           user.skills.number_protection = user.skills.number_protection + Math.floor((1+abilities_learn) *
                    (damage_hull/10 + damage_sails/10)*experience[user.ship.index_ship].protection);
           if (user.skills.number_protection >= Math.floor(Math.pow(user.skills.protection+1, 2.55))) {
             user.skills.number_protection = user.skills.number_protection -
                                          Math.floor(Math.pow(user.skills.protection+1, 2.55));
             user.skills.protection = user.skills.protection + 1;
           }
           user.skills.number_resistance = user.skills.number_resistance + Math.floor((1+abilities_learn) *
                   damage_team/10*experience[user.ship.index_ship].protection);
           if (user.skills.number_resistance >= Math.floor(Math.pow(user.skills.resistance+1, 2.58))) {
             user.skills.number_resistance = user.skills.number_resistance -
                                          Math.floor(Math.pow(user.skills.resistance+1, 2.58));
             user.skills.resistance = user.skills.resistance + 1;
           }
           var guns_krit = 0;
           var krit_chance = 5;
           for (var i = 0; i < guns_hit; i++) {
             var chance = Math.random() * 100;

             if (krit_chance >= chance) {
               guns_krit++;
             }
           }
           var krit_logWar = 0;
           if (guns_krit > 0) {
             krit_logWar = 1;
           }
           guns_hit = guns_hit - guns_krit;
           //   Расчет УРОНА
           damage_hull = (damage_hull * guns_hit + damage_hull*guns_krit*10)*
                         guns[user.boti.ship.guns.funt_guns].damage;
           damage_sails = (damage_sails * guns_hit + damage_sails*guns_krit*10)*
                         guns[user.boti.ship.guns.funt_guns].damage;
           damage_team = (damage_team * guns_hit + damage_team*guns_krit*10)*
                         guns[user.boti.ship.guns.funt_guns].damage;
           //  + skills
           var skills = user.boti.skills.marksmanship;
           damage_hull = damage_hull + damage_hull*skills/100;
           damage_sails = damage_sails + damage_sails*skills/100;
           damage_team = damage_team + damage_team*skills/100;
           // + protection and resistance ENEMY
           damage_hull = damage_hull / (1 + user.skills.protection*0.6/100);
           damage_sails = damage_sails / (1 + user.skills.protection*0.6/100);
           damage_team = damage_team / (1 + user.skills.resistance/100);
           // + abilities enemy
           if (user.abilities.protection_ship.activity == 1 && user.abilities.protection_ship.level > 0) {
             damage_hull = damage_hull * (1 -
                 abilities.protection_ship.levels_proc[user.abilities.protection_ship.level]/100);
             damage_sails = damage_sails * (1 -
                 abilities.protection_ship.levels_proc[user.abilities.protection_ship.level]/100);
           }

           // Урон высчитывается
           if (Math.round(damage_hull) >= user.ship.hull-1) {
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

             user.pesos = 0;
             user.war.waiting = Math.floor(Math.random() * 15 + 23);
             user.war.activity_war = 6;
             user.war.last_action = new Date;
            user.boti.war.activity_war = 6;

             //    Journal
             Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
               if (err) {
                 if (err instanceof AuthError_journal) {
                   return next(new HttpError(403, err.message));
                 } else {
                     return next(err);
                 }
                 }
                 if (journal) {
                   var rating_win = 0;
                   if (user.war.enemy_value == 1) {
                     rating_win = 1;
                   } else if (user.war.enemy_value == 0) {
                     rating_win = 2;
                   }
                   journal.rating = rating_win;
                   journal.value_war = 0; // потопить
                   if (journal.sender == user.username) {
                     journal.number_one = 1;
                   } else {
                     journal.number_one = 0;
                   }
                   journal.reward = -user.war.reward;
                   journal.created = new Date;
                   journal.save(function (err) {
                     if(err) return next(err);
                   });

                   //    LogWar
                   LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                     if (!logWars[0]) {
                       logWars[0] = 0;
                     }
                     if (logWars.length < 5) {
                       var logWar = new LogWar({
                         sender: user.war.user_war,
                         recipient: user.username,
                         damage_one: Math.round(damage_hull) + Math.round(damage_sails) + Math.round(damage_team),
                         damage_two: guns_delete,
                         charge: user.boti.ship.guns.charge,
                         krit_true: krit_logWar,
                         team_res: 0,
                         value_war: 0, // zalp
                         created: new Date
                       });
                       logWar.save(function (err) {
                         if(err) throw err;
                       });
                       logWars[logWars.length] = logWar;
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
                       logWars[value_delete].damage_one = Math.round(damage_hull) + Math.round(damage_sails) + Math.round(damage_team),
                       logWars[value_delete].damage_two = guns_delete,
                       logWars[value_delete].charge = user.boti.ship.guns.charge,
                       logWars[value_delete].krit_true = krit_logWar,
                       logWars[value_delete].team_res = 0,
                       logWars[value_delete].value_war = 0; // zalp
                       logWars[value_delete].created = new Date;
                       logWars[value_delete].save(function (err) {
                         if(err) throw err;
                       });

                     }
                     var position = 0;
                     var logWars_poryadok = [];
                     for (var i = 0; i < logWars.length; i++) {
                       for (var j = 0; j < logWars_poryadok.length; j++) {
                           if (logWars_poryadok[j].created < logWars[i].created) {
                             position = j;
                             break;
                           }
                       }
                         logWars_poryadok.splice(position, 0, logWars[i]);
                         position=logWars_poryadok.length;
                     }
                 });
                 }
               });
           } else { // Не критично

             rip_team = Math.round(damage_team / 10);
             var team = user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners;
             if (rip_team > team) {
               rip_team = team;
             }
             var team_res = 0;
             if (rip_team > 0 && user.ship.supplies.drugs > 0) {
               var treatment_board = require('./treatment_board');
               var rip_team1 = treatment_board.Treatment_board(rip_team, user);
               team_res = rip_team - rip_team1;
               rip_team = rip_team1;
             }
             if (Math.round(damage_sails) > user.ship.sails) {
               damage_sails = user.ship.sails;
             }
             user.ship.hull = user.ship.hull - Math.round(damage_hull);
             user.ship.sails = user.ship.sails - Math.round(damage_sails);
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

             var ship_update = require('./ship_update');
             ship_update.Ship_update(user);

             //    LogWar
             LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
               if (!logWars[0]) {
                 logWars[0] = 0;
               }
               if (logWars.length < 5) {
                 var logWar = new LogWar({
                   sender: user.war.user_war,
                   recipient: user.username,
                   damage_one: Math.round(damage_hull) + Math.round(damage_sails) + Math.round(damage_team),
                   damage_two: guns_delete,
                   charge: user.boti.ship.guns.charge,
                   krit_true: krit_logWar,
                   team_res: team_res,
                   value_war: 0, // zalp
                   created: new Date
                 });
                 logWar.save(function (err) {
                   if(err) throw err;
                 });
                 logWars[logWars.length] = logWar;
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
                 logWars[value_delete].damage_one = Math.round(damage_hull) + Math.round(damage_sails) + Math.round(damage_team),
                 logWars[value_delete].damage_two = guns_delete,
                 logWars[value_delete].charge = user.boti.ship.guns.charge,
                 logWars[value_delete].krit_true = krit_logWar,
                 logWars[value_delete].team_res = team_res,
                 logWars[value_delete].value_war = 0; // zalp
                 logWars[value_delete].created = new Date;
                 logWars[value_delete].save(function (err) {
                   if(err) throw err;
                 });

               }
           });
           }
         }
       }
     }
   }

   if (user.boti.war.activity_war == 3) {
     // ВЫБОР ДЕЙСТВИЯ
        var prev_hull = user.boti.ship.hull/user.ship.hull;
        var prev_speed = user.boti.ship.speed/user.ship.speed;
        var prev_team = (user.boti.ship.team.sailors+user.boti.ship.team.boarders*3+user.boti.ship.team.gunners)/
                         (user.ship.team.sailors+user.ship.team.boarders*3+user.ship.team.gunners);

      //  АБОРДАЖ
         if (prev_speed > prev_hull && prev_team > 1.4 && prev_speed > 1.4 ||
             user.boti.ship.supplies.gunpowder == 0 && prev_speed > 1.3 ||
            user.boti.ship.supplies.barshots == 0 && user.boti.ship.supplies.core == 0 && prev_speed > prev_hull &&
            prev_team > 1.2 && prev_speed > 1.3) {
              user.boti.war.waiting = 30;
              user.boti.war.last_action = new Date;
              user.boti.war.activity_war = 4;
         }
     if (user.boti.ship.supplies.gunpowder > 0) {
       //  ХЕРАЧИТЬ КОРПУС
           if (prev_hull > prev_speed && prev_hull > prev_team) {
             if (user.boti.ship.supplies.bombs > 0 && user.boti.ship.guns.charge != 3) {
               user.boti.ship.guns.charge = 3;
               user.boti.war.last_recharge = new Date;
             }
           }
       //  ХЕРАЧИТЬ ПАРУСА
          else if (prev_team > prev_speed && prev_team > prev_hull) {
             if (user.boti.ship.supplies.barshots > 0 && user.boti.ship.guns.charge != 2) {
               user.boti.ship.guns.charge = 2;
               user.boti.war.last_recharge = new Date;
             }
           }
        //  ХЕРАЧИТЬ КОМАНДУ
            else if (prev_speed > prev_hull && prev_speed > prev_team) {
              if (user.boti.ship.supplies.buckshot > 0 && user.boti.ship.guns.charge != 1) {
                user.boti.ship.guns.charge = 1;
                user.boti.war.last_recharge = new Date;
              }
            }
            // ЯДРA
            else if (user.boti.ship.supplies.bombs == 0 && user.boti.ship.guns.charge == 3 ||
                    user.boti.ship.supplies.barshots == 0 && user.boti.ship.guns.charge == 2 ||
                    user.boti.ship.supplies.buckshot == 0 && user.boti.ship.guns.charge == 1) {
              if (user.boti.ship.supplies.core > 0 && user.boti.ship.guns.charge != 0) {
                user.boti.ship.guns.charge = 0;
                user.boti.war.last_recharge = new Date;
              } else if (user.boti.ship.supplies.bombs > 0) {
                user.boti.ship.guns.charge = 3;
                user.boti.war.last_recharge = new Date;
              } else if (user.boti.ship.supplies.barshots > 0) {
                user.boti.ship.guns.charge = 2;
                user.boti.war.last_recharge = new Date;
              } else if (user.boti.ship.supplies.buckshot > 0) {
                user.boti.ship.guns.charge = 1;
                user.boti.war.last_recharge = new Date;
              }
            }
            else {
              if (user.boti.ship.supplies.core > 0 && user.boti.ship.guns.charge != 0) {
                user.boti.ship.guns.charge = 0;
                user.boti.war.last_recharge = new Date;
              }
            }
     }
   }


 }
 else if (user.boti.war.activity_war == 4) {   //  АБОРДАЖ
   if (date_now.getTime()/1000 >= user.boti.war.last_action.getTime()/1000 + user.boti.war.waiting-1) {
     var boards_bot = require('./boards_bot');
     boards_bot.Boards_bot(user);
     var ship_update = require('./ship_update');
     ship_update.Ship_update(user);
   } else { // КОНТРОЛЬ ОТМЕНЫ Абордажа
       if (user.boti.ship.speed / user.ship.speed < 1.3 /* || user.boti.ship.speed == 0 && user.ship.speed*/) {
         user.boti.war.waiting = 120;
         user.boti.war.last_action = new Date;
         user.boti.war.activity_war = 3;
       }
   }
 }
}
