var ship = require('./ship').list_ships;
var abilities = require('./abilities').abilities;
var guns = require('./guns').list_guns;

module.exports.Boti_update = function (boti) {

 boti.ship.hold = Math.floor((boti.ship.supplies.core/10 + boti.ship.supplies.buckshot/10
   + boti.ship.supplies.barshots/10*2 + boti.ship.supplies.bombs/10 +
   boti.ship.supplies.gunpowder/20 +
   boti.ship.supplies.weapons/5 + boti.ship.supplies.drugs/20 +
   boti.ship.team.sailors + boti.ship.team.boarders + boti.ship.team.gunners +
   (boti.ship.guns.number_guns * guns[boti.ship.guns.funt_guns].weight))*100)/100;
 var n = Math.floor(ship[boti.ship.index_ship].hull / 100);
 var speed = Math.floor(((15 * boti.ship.sails) / (Math.pow(1.01,n) *
                   (ship[boti.ship.index_ship].hull + boti.ship.hold) * 0.55))*100)/100;
 var mobility = Math.floor((ship[boti.ship.index_ship].mobility/2 +
                     ((2000 * speed) / (ship[boti.ship.index_ship].hull +
                     ship[boti.ship.index_ship].sails))/2)*100)/100;
var team = boti.ship.team.sailors*3 + boti.ship.team.boarders + boti.ship.team.gunners;
team += team * boti.skills.navigation /100;
if (Math.floor(ship[boti.ship.index_ship].team*0.1*3)+1 > team) {
 var proc = (Math.floor(ship[boti.ship.index_ship].team*0.1*3)+1 - team)/
             (Math.floor(ship[boti.ship.index_ship].team*0.1*3)+1);
 boti.ship.speed = Math.floor((speed/2 + (1 - proc)*(speed/2))*100)/100;
 boti.ship.mobility = Math.floor((mobility*0.75 + (1 - proc)*(mobility*0.25))*100)/100;
} else {
 team = team - Math.floor(ship[boti.ship.index_ship].team*0.1*3)+1;
 boti.ship.speed = Math.floor((speed + speed * team * 0.01)*100)/100;
 boti.ship.mobility = Math.floor((mobility + (mobility/2) * team * 0.01)*100)/100;
}
};


/*var speed_abilities = 0;
var mobility_abilities = 0;
Object.keys(boti.abilities).forEach(function (key) {
  if (boti.abilities[key].name == 'speed_ship') {
    speed_abilities = abilities.speed_ship.levels_proc[boti.abilities[key].level];
  }
});
Object.keys(boti.abilities).forEach(function (key) {
  if (boti.abilities[key].name == 'maneuverability_ship') {
    mobility_abilities = abilities.maneuverability_ship.levels_proc
                     [boti.abilities[key].level];
  }
});

 boti.ship.speed = Math.floor((boti.ship.speed + boti.ship.speed * speed_abilities * 0.01)*100)/100;

 boti.ship.mobility = Math.floor((boti.ship.mobility + boti.ship.mobility * mobility_abilities * 0.01)*100)/100;*/
