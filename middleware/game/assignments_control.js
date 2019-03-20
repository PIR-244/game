var experience = require('./experience').experience;
var User = require('../../models/user').User;
var Journal = require('../../models/journal').Journal;

module.exports.Assignments_control = function (user) {
 var date_now = new Date();

 if (user.war.activity_war == 0) { // ПОИСК ПИРАТА
   if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting-1) {
     var pirates_soxr = require('./pirates_soxr');
     pirates_soxr.Pirates_soxr(user);
   }
 }
 else if (user.war.activity_war == 1) {   //  ОЖИДАНИЕ ПОДТВЕРЖДЕНИЯ
   if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting-1) {
     user.war.waiting = Math.floor(Math.random() * 15 + 23);
     user.war.last_action = new Date;
     user.war.activity_war = 6;
     user.ship.plavanie = 1;
     user.last_action = new Date;
   }
 }
 else if (user.war.activity_war == 2) {   //  ДОСТАВКА ГРУЗА
   if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting-1) {
     user.war.last_action = new Date;
     user.war.activity_war = 4;
     user.last_action = new Date;
     if (user.assignments.shop.activity == 1 || user.assignments.shop.activity == 4) {
        var shop = require('./shop').list_products;
       user.assignments.shop.activity++;
       user.ship.supplies[shop[user.assignments.shop.index_cargo].name_eng] += Math.floor(user.assignments.shop.cargo/
            shop[user.assignments.shop.index_cargo].weight_pack*shop[user.assignments.shop.index_cargo].number_pack*0.2);
       user.rating.number_rating = user.rating.number_rating + 1;
       //    Journal
         Journal.find_journals(user.username, function (err, journals) {
             if (!journals[0]) {
               journals[0] = 0;
             }
             if (journals.length < 100) {
               var journal = new Journal({
                 sender: user.username,
                 recipient: 'ass',
                 value_war: 5, // shop_true
                 number_one: 0,
                 reward: Math.floor(user.assignments.shop.cargo/
                      shop[user.assignments.shop.index_cargo].weight_pack*shop[user.assignments.shop.index_cargo].number_pack*0.2),
                 rating: 1,
                 bot_name: shop[user.assignments.shop.index_cargo].name,
                 created: new Date
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
               journal[value_delete].recipient = 'ass';
               journal[value_delete].value_war = 5; // shop_true
               journal[value_delete].number_one = 0;
               journal[value_delete].reward = Math.floor(user.assignments.shop.cargo/
                    shop[user.assignments.shop.index_cargo].weight_pack*shop[user.assignments.shop.index_cargo].number_pack*0.2);
               journal[value_delete].rating = 1;
               journal[value_delete].bot_name = shop[user.assignments.shop.index_cargo].name;
               logWars[value_delete].created = new Date;
               journals[value_delete].save(function (err) {
                 if(err) throw err;
               });

             }
           });
           if (user.assignments.shop.activity == 2) {
             var assign_one = require('./assign_one');
             assign_one.Assign_one(user, 'shop');
           }
           var abilities_learn = 0;
           if (user.abilities.learnbility.activity == 1 && user.abilities.learnbility.level > 0) {
             var abilities = require('./abilities').abilities;
             abilities_learn = abilities.learnbility.levels_proc[user.abilities.learnbility.level]/100;
           }
           user.skills.number_navigation = user.skills.number_navigation +
                          Math.floor((1+abilities_learn) * experience[user.ship.index_ship].navigation);
           if (user.skills.number_navigation >= Math.floor(Math.pow(user.skills.navigation+1, 2.57))) {
             user.skills.number_navigation = user.skills.number_navigation -
                                          Math.floor(Math.pow(user.skills.navigation+1, 2.57));
             user.skills.navigation = user.skills.navigation + 1;
           }
     }
   }
 }
 else if (user.war.activity_war == 3) {   //  ПЕРЕВОЗКА ПАССАЖИРОВ
   if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting-1) {
     user.war.last_action = new Date;
     user.last_action = new Date;
     user.war.activity_war = 4;
     if (user.assignments.tavern.activity == 1 || user.assignments.tavern.activity == 4) {

       // TRAINING
       if (user.training == 19) {
         user.training++;
       }

       user.assignments.tavern.activity++;
       user.pesos += user.assignments.tavern.reward;
       user.rating.number_rating = user.rating.number_rating + 1;
       //    Journal
         Journal.find_journals(user.username, function (err, journals) {
             if (!journals[0]) {
               journals[0] = 0;
             }
             var name_true = '';
             if (journals.length < 100) {
               var journal = new Journal({
                 sender: user.username,
                 recipient: 'ass',
                 value_war: 6, // tavern_true
                 number_one: 0,
                 reward: user.assignments.tavern.reward,
                 rating: 1,
                 bot_name: name_true,
                 created: new Date
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
               journal[value_delete].recipient = 'ass';
               journal[value_delete].value_war = 6; // tavern_true
               journal[value_delete].number_one = 0;
               journal[value_delete].reward = user.assignments.tavern.reward;
               journal[value_delete].rating = 1;
               journal[value_delete].bot_name = name_true;
               logWars[value_delete].created = new Date;
               journals[value_delete].save(function (err) {
                 if(err) throw err;
               });

             }
           });
           if (user.assignments.tavern.activity == 2) {
             var assign_one = require('./assign_one');
             assign_one.Assign_one(user, 'tavern');
           }
           var abilities_learn = 0;
           if (user.abilities.learnbility.activity == 1 && user.abilities.learnbility.level > 0) {
             var abilities = require('./abilities').abilities;
             abilities_learn = abilities.learnbility.levels_proc[user.abilities.learnbility.level]/100;
           }
           user.skills.number_navigation = user.skills.number_navigation +
                          Math.floor((1+abilities_learn) * experience[user.ship.index_ship].navigation);
           if (user.skills.number_navigation >= Math.floor(Math.pow(user.skills.navigation+1, 2.57))) {
             user.skills.number_navigation = user.skills.number_navigation -
                                          Math.floor(Math.pow(user.skills.navigation+1, 2.57));
             user.skills.navigation = user.skills.navigation + 1;
           }
     }
   }
 }
 else /*if (user.war.activity_war == 4)*/ {   //  return_home
   if (date_now.getTime()/1000 >= user.war.last_action.getTime()/1000 + user.war.waiting-1) {
   user.war.activity_war = 0;
   user.ship.plavanie = 0;
   user.war.user_war = 0;
   user.ship.created = new Date;
   }
 }

}
