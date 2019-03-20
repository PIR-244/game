var experience = require('./experience').experience;
var User = require('../../models/user').User;
var Journal = require('../../models/journal').Journal;
var LogWar = require('../../models/logWar').LogWar;

module.exports.Battle_control = function (user) {
 var date_now = new Date();
 if (user.war.activity_war == 0) {
   if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting) {
     var enemy_soxr = require('./enemy_soxr');
     enemy_soxr.Enemy_soxr(user);
   }
 } else if (user.war.activity_war == 1) { //   Ожидание подтверждения
   if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting) {
     user.war.waiting = Math.floor(Math.random() * 22 + 33);
     user.war.activity_war = 0;
     user.war.last_action = new Date;
     //    Journal
     Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
         if (journal) {
           journal.remove(function (err) {
             if(err) throw err;
           });
         }
       });
   }
 } else if (user.war.activity_war == 2) {   //    Ожидание начала боя
   if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting-1) {
     user.war.waiting = 120;
     user.war.last_action = new Date;
     user.war.activity_war = 3;
       user.boti.war.waiting = 120;
       user.boti.war.last_action = new Date;
       user.boti.war.activity_war = 3;
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
   }
 } else if (user.war.activity_war == 3) {
   if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting &&
        date_now.getTime()/1000 >= user.boti.war.last_action.getTime()/1000 + user.boti.war.waiting &&
            user.boti.war.activity_war == 3) {
              user.war.waiting = Math.floor(Math.random() * 15 + 23);
              user.war.last_action = new Date;
              user.war.activity_war = 6;

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
 } else if (user.war.activity_war == 4) {   //  АБОРДАЖ
   if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting-1) {
     var boards_battle = require('./boards_battle');
     boards_battle.Boards_battle(user);
     var ship_update = require('./ship_update');
     ship_update.Ship_update(user);
   } else { // КОНТРОЛЬ ОТМЕНЫ Абордажа
       if (user.ship.speed / user.boti.ship.speed < 1.3) {
         user.war.waiting = 120;
         user.war.last_action = new Date;
         user.war.activity_war = 3;
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
       if (user.ship.speed / user.boti.ship.speed < 1.3) {
         user.war.waiting = 120;
         user.war.last_action = new Date;
         user.war.activity_war = 3;
       }
   }

 } else /*if (user.war.activity_war == 6)*/ {
   if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting) {
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

   }
 }



}
