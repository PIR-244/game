var guns = require('./guns').list_guns;
 var ship = require('./ship').list_ships;
var abilities = require('./abilities').abilities;

module.exports.Time_recharge = function (req, res, sek_time_recharge, chance_explosion, user) {
  sek_time_recharge = guns[user.ship.guns.funt_guns].recharge;
  chance_explosion =  guns[user.ship.guns.funt_guns].chance_explosion;
  var team = user.ship.team.sailors + user.ship.team.boarders + user.ship.team.gunners*3;
  if (Math.ceil(ship[user.ship.index_ship].team*0.2*3) > team) {
    var proc = Math.ceil(ship[user.ship.index_ship].team*0.2*3)/team;
    if (proc>10) {
      proc = 10;
    }
    sek_time_recharge = sek_time_recharge*proc;
    chance_explosion = chance_explosion*proc;
  } else {
    team = team - Math.ceil(ship[user.ship.index_ship].team*0.2*3);
    if (team > Math.ceil(ship[user.ship.index_ship].team*0.5*3)) {
      team = Math.ceil(ship[user.ship.index_ship].team*0.5*3);
    }
    var proc = team/Math.ceil(ship[user.ship.index_ship].team*0.5*3);
    sek_time_recharge = Math.ceil(sek_time_recharge/2 + ((1-proc)*sek_time_recharge)/2);
    chance_explosion = Math.ceil((1-proc)*chance_explosion);
  }
  if (user.abilities.fast_recharge.activity == 1 && user.abilities.fast_recharge.level > 0) {
    sek_time_recharge = Math.round(sek_time_recharge *
        (1-abilities.fast_recharge.levels_proc[user.abilities.fast_recharge.level]/100));
  }
  req.chance_explosion = chance_explosion;
  req.time_recharge = res.locals.time_recharge = sek_time_recharge;
};
