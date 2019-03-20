 var ship = require('./ship').list_ships;
 var shop = require('./shop').list_products;
 var pirates = require('./pirates').list_pirates;
 var boti = require('./boti').bots_standart;

module.exports.Assignments_create = function (user) {

  var list_ports = ['в порт Ямайки', 'в Порт-Рояль', 'на остров Святой Марии',
   'на Тортугу', 'в залив Клю', 'в порт Нью-Провиденс', 'в порт Бартария-Бей',
   'на остров Галвестон'];

  user.assignments.shop.name_port = list_ports[Math.floor(Math.random() * 8)];
  user.assignments.shop.index_cargo = Math.floor(Math.random() * 8);
user.assignments.shop.cargo = Math.floor(Math.floor(Math.random() * 16 + 35) * 0.01 * ship[user.ship.index_ship].hold);
if(user.assignments.index_ship != user.ship.index_ship && user.assignments.shop.activity == 1) {
   user.assignments.shop.activity = 0;
}
else if(user.assignments.index_ship != user.ship.index_ship && user.assignments.shop.activity == 4) {
   user.assignments.shop.activity = 3;
}
else if (user.assignments.index_ship == user.ship.index_ship) {
  if (user.assignments.shop.activity == 1 || user.assignments.shop.activity == 4) {
    user.assignments.shop.activity = 0;
    var ship_update = require('./ship_update');
    ship_update.Ship_update(user);
  } else {
    user.assignments.shop.activity = 0;
  }
}



user.assignments.tavern.name_port = list_ports[Math.floor(Math.random() * 8)];
user.assignments.tavern.reward = Math.floor(Math.random() * ((boti[user.ship.index_ship].reward)*0.45*0.6) + (boti[user.ship.index_ship].reward*0.45-(boti[user.ship.index_ship].reward)*0.3*0.45));
if(user.assignments.index_ship != user.ship.index_ship && user.assignments.tavern.activity == 1) {
   user.assignments.tavern.activity = 0;
}
else if(user.assignments.index_ship != user.ship.index_ship && user.assignments.tavern.activity == 4) {
   user.assignments.tavern.activity = 3;
}
else if (user.assignments.index_ship == user.ship.index_ship) {
  user.assignments.tavern.activity = 0;
}

user.assignments.residence.name_pirates = pirates[Math.floor(Math.random() * 90)];
user.assignments.residence.reward = Math.floor(Math.random() * 3 + 2);
if(user.assignments.index_ship != user.ship.index_ship && user.assignments.residence.activity == 1) {
   user.assignments.residence.activity = 0;
}
else if (user.assignments.index_ship == user.ship.index_ship) {
  user.assignments.residence.activity = 0;
}

if (user.assignments.index_ship != user.ship.index_ship) user.assignments.index_ship = user.ship.index_ship;
else {
  var date_now = new Date();
  user.assignments.created = new Date(date_now.getFullYear(), date_now.getMonth(), date_now.getDate())
}

};
