var ship = require('./ship').list_ships;
var shop = require('./shop').list_products;
var pirates = require('./pirates').list_pirates;
var boti = require('./boti').bots_standart;

module.exports.Assign_one = function (user, assignments_value) {

 var list_ports = ['в порт Ямайки', 'в Порт-Рояль', 'на остров Святой Марии',
  'на Тортугу', 'в залив Клю', 'в порт Нью-Провиденс', 'в порт Бартария-Бей',
  'на остров Галвестон'];

if (assignments_value == 'shop') {
  user.assignments.shop.name_port = list_ports[Math.floor(Math.random() * 8)];
  user.assignments.shop.index_cargo = Math.floor(Math.random() * 8);
 user.assignments.shop.cargo = Math.floor(Math.floor(Math.random() * 16 + 35) / 100 * ship[user.ship.index_ship].hold);
  user.assignments.shop.activity = 3;
}



if (assignments_value == 'tavern') {
  user.assignments.tavern.name_port = list_ports[Math.floor(Math.random() * 8)];
  user.assignments.tavern.reward = Math.floor(Math.random() * ((boti[user.ship.index_ship].reward)*0.45*0.6) + (boti[user.ship.index_ship].reward*0.45-(boti[user.ship.index_ship].reward)*0.3*0.45));
   user.assignments.tavern.activity = 3;
}

};
