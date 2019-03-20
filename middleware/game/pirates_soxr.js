var ship = require('./ship').list_ships;
var abilities = require('./abilities').abilities;
var boti = require('./boti').bots_standart;
var User = require('../../models/user').User;
var experience = require('./experience').experience;
var Journal = require('../../models/journal').Journal;

module.exports.Pirates_soxr = function (user) {

       user.war.user_war = 'bot';
       user.war.waiting = 60;
       user.war.activity_war = 1;
       user.boti.username = user.assignments.residence.name_pirates;
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
                 rating: -1,
                 bot_name: name_true
               });
               journal.save(function (err) {
                 if(err) throw err;
               });
             } else {

               var position = 0;
               var journals_poryadok = [];
               var value_delete = 0;
               for (var i = 1; i < journals.length; i++) {
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

               journals[value_delete].sender = user.username;
               journals[value_delete].recipient = user.war.user_war;
               journals[value_delete].rating = -1;
               journals[value_delete].bot_name = name_true
               journals[value_delete].save(function (err) {
                 if(err) throw err;
               });

             }
           });
       if (user.war.enemy_value == 0) {
         if (user.ship.index_ship == 0) {
           user.war.enemy_value == 1;
           user.boti.ship.index_ship = 0;
         } else if (user.ship.index_ship > 0 && user.ship.index_ship <= 3) {
           user.boti.ship.index_ship = user.ship.index_ship - 1;
         } else if (user.ship.index_ship > 3 && user.ship.index_ship <= 6) {
           user.boti.ship.index_ship = 3;
         } else if (user.ship.index_ship > 6 && user.ship.index_ship <= 9) {
           user.boti.ship.index_ship = Math.floor(Math.random() * 3 + 4);
         } else if (user.ship.index_ship > 9 && user.ship.index_ship <= 12) {
           user.boti.ship.index_ship = Math.floor(Math.random() * 3 + 7);
         }
       } else if (user.war.enemy_value == 1) {
          if (user.ship.index_ship >= 0 && user.ship.index_ship <= 3) {
           user.boti.ship.index_ship = user.ship.index_ship;
         } else if (user.ship.index_ship > 3 && user.ship.index_ship <= 6) {
           user.boti.ship.index_ship = Math.floor(Math.random() * 3 + 4);
         } else if (user.ship.index_ship > 6 && user.ship.index_ship <= 9) {
           user.boti.ship.index_ship = Math.floor(Math.random() * 3 + 7);
         } else if (user.ship.index_ship > 9 && user.ship.index_ship <= 12) {
           user.boti.ship.index_ship = Math.floor(Math.random() * 3 + 10);
         }
       } else {
          if (user.ship.index_ship >= 0 && user.ship.index_ship < 3) {
           user.boti.ship.index_ship = user.ship.index_ship+1;
         } else if (user.ship.index_ship == 3) {
           user.boti.ship.index_ship = Math.floor(Math.random() * 3 + 4);
         } else if (user.ship.index_ship > 3 && user.ship.index_ship <= 6) {
           user.boti.ship.index_ship = Math.floor(Math.random() * 3 + 7);
         } else if (user.ship.index_ship > 6 && user.ship.index_ship <= 9) {
           user.boti.ship.index_ship = Math.floor(Math.random() * 3 + 10);
         } else if (user.ship.index_ship > 9 && user.ship.index_ship <= 12) {
           user.boti.ship.index_ship = Math.floor(Math.random() * 3 + 10);
           user.war.enemy_value = 1;
         }
       }
       user.boti.ship.hull = ship[user.boti.ship.index_ship].hull;
       user.boti.ship.sails = ship[user.boti.ship.index_ship].sails;
       user.boti.ship.guns.number_guns = ship[user.boti.ship.index_ship].guns.number_guns;
       if (ship[user.boti.ship.index_ship].guns.funt_guns == 8) {
         user.boti.ship.guns.funt_guns = 0;
       } else if (ship[user.boti.ship.index_ship].guns.funt_guns == 12) {
         user.boti.ship.guns.funt_guns = 1;
       } else if (ship[user.boti.index_ship].guns.funt_guns == 18) {
         user.boti.ship.guns.funt_guns = 2;
       } else {
         user.boti.ship.guns.funt_guns = 3;
       }
       if (user.boti.ship.index_ship >= 0 && user.boti.ship.index_ship < 4) {
         user.boti.ship.guns.charge = 0;
       } else if (user.boti.ship.index_ship == 4 || user.boti.ship.index_ship == 7
                       || user.boti.ship.index_ship == 11) {
         user.boti.ship.guns.charge = 2;
       } else if (user.boti.ship.index_ship == 5 || user.boti.ship.index_ship == 8
                       || user.boti.ship.index_ship == 10) {
         user.boti.ship.guns.charge = 3;
       } else if (user.boti.ship.index_ship == 6 || user.boti.ship.index_ship == 12
                       || user.boti.ship.index_ship == 9) {
         user.boti.ship.guns.charge = 1;
       }
       var date_now = new Date;
       user.boti.war.last_recharge = new Date(date_now.getTime() - 60*1000);
       user.boti.ship.team = boti[user.boti.ship.index_ship].team;
       user.boti.ship.supplies = boti[user.boti.ship.index_ship].supplies;
       //   добавил 0.1 к 0.3 и к 0.85
       user.boti.skills.marksmanship = Math.ceil(Math.random() *
                  boti[user.boti.ship.index_ship].marksmanship*0.4 +
                  boti[user.boti.ship.index_ship].marksmanship*0.95);
       user.boti.skills.boarding = Math.ceil(Math.random() *
                  boti[user.boti.ship.index_ship].boarding*0.4 +
                  boti[user.boti.ship.index_ship].boarding*0.95);
       user.boti.skills.resistance = Math.ceil(Math.random() *
                  boti[user.boti.ship.index_ship].resistance*0.4 +
                  boti[user.boti.ship.index_ship].resistance*0.95);
       user.boti.skills.protection = Math.ceil(Math.random() *
                  boti[user.boti.ship.index_ship].protection*0.4 +
                  boti[user.boti.ship.index_ship].protection*0.95);
       user.boti.skills.navigation = Math.ceil(Math.random() *
                  boti[user.boti.ship.index_ship].navigation*0.4 +
                  boti[user.boti.ship.index_ship].navigation*0.95);
       var boti_update = require('./boti_update');
       boti_update.Boti_update(user.boti);
       var enemy_avatar = '6';
       if (user.boti.skills.navigation >= 10) {
         enemy_avatar = '2';
       } else if (user.boti.skills.navigation >= 25) {
         enemy_avatar = '3';
       } else if (user.boti.skills.navigation >= 40) {
         enemy_avatar = '1';
       } else if (user.boti.skills.navigation >= 65) {
         enemy_avatar = '4';
       } else if (user.boti.skills.navigation >= 100) {
         enemy_avatar = '5';
       }
       user.boti.avatar_index = enemy_avatar;

     user.war.last_action = new Date;
     var abilities_learn = 0;
     if (user.abilities.learnbility.activity == 1 && user.abilities.learnbility.level > 0) {
       var abilities = require('./abilities').abilities;
       abilities_learn = abilities.learnbility.levels_proc[user.abilities.learnbility.level]/100;
     }
     user.skills.number_navigation = user.skills.number_navigation +
                    Math.floor((1+abilities_learn) * experience[user.ship.index_ship].navigation/2);
     if (user.skills.number_navigation >= Math.floor(Math.pow(user.skills.navigation+1, 2.57))) {
       user.skills.number_navigation = user.skills.number_navigation -
                                    Math.floor(Math.pow(user.skills.navigation+1, 2.57));
       user.skills.navigation = user.skills.navigation + 1;
     }



}
