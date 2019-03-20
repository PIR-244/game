 var ship = require('./ship').list_ships;
 var abilities = require('./abilities').abilities;
 var guns = require('./guns').list_guns;

module.exports.Ship_update = function (user) {
  var assignments_cargo = 0;
  if (user.assignments.shop.activity == 1 || user.assignments.shop.activity == 4) {
    assignments_cargo = user.assignments.shop.cargo;
  }
  user.ship.hold = Math.floor((user.ship.supplies.core/10 + user.ship.supplies.buckshot/10
    + user.ship.supplies.barshots/10*2 + user.ship.supplies.bombs/10 +
    user.ship.supplies.gunpowder/20 + user.ship.supplies.food/10 +
    user.ship.supplies.weapons/5 + user.ship.supplies.drugs/20 + assignments_cargo +
    user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners +
    (user.ship.guns.number_guns * guns[user.ship.guns.funt_guns].weight))*100)/100;
  var n = Math.floor(ship[user.ship.index_ship].hull / 100);
  var speed = Math.floor(((15 * user.ship.sails) / (Math.pow(1.01,n) *
                    (ship[user.ship.index_ship].hull + user.ship.hold) * 0.55))*100)/100;
  var mobility = Math.floor((ship[user.ship.index_ship].mobility/2 +
                      ((2000 * speed) / (ship[user.ship.index_ship].hull +
                      ship[user.ship.index_ship].sails))/2)*100)/100;
var team = user.ship.team.sailors*3 + user.ship.team.boarders + user.ship.team.gunners;
team += team * user.skills.navigation /100;
if (Math.floor(ship[user.ship.index_ship].team*0.1*3)+1 > team) {
  var proc = (Math.floor(ship[user.ship.index_ship].team*0.1*3)+1 - team)/
              (Math.floor(ship[user.ship.index_ship].team*0.1*3)+1);
  user.ship.speed = Math.floor((speed/2 + (1 - proc)*(speed/2))*100)/100;
  user.ship.mobility = Math.floor((mobility*0.75 + (1 - proc)*(mobility*0.25))*100)/100;
} else {
  team = team - Math.floor(ship[user.ship.index_ship].team*0.1*3)+1;
  user.ship.speed = Math.floor((speed + speed * team * 0.01)*100)/100;
  user.ship.mobility = Math.floor((mobility + (mobility/2) * team * 0.01)*100)/100;
}
var speed_abilities = 0;
var mobility_abilities = 0;
if(user.abilities.speed_ship.activity == 1)
speed_abilities = abilities.speed_ship.levels_proc[user.abilities.speed_ship.level];
if(user.abilities.maneuverability_ship.activity == 1)
mobility_abilities = abilities.maneuverability_ship.levels_proc
                  [user.abilities.maneuverability_ship.level];

  user.ship.speed = Math.floor((user.ship.speed + user.ship.speed * speed_abilities * 0.01)*100)/100;

  user.ship.mobility = Math.floor((user.ship.mobility + user.ship.mobility * mobility_abilities * 0.01)*100)/100;

};
