var ship = require('./ship').list_ships;
var abilities = require('./abilities').abilities;
var potions = require('./potions').potions;

module.exports.Ship_repairs = function (user) {

   var potions_true = 0;
   var abilities_true = 0;
   var date_now = new Date;
   if(date_now <= user.potions.bottle_repairman.created)
      potions_true = potions[2].proc;
    if(user.abilities.quick_fix.activity != 0)
      abilities_true = abilities.quick_fix.levels_proc[user.abilities.quick_fix.level];

    per_data = new Date(date_now - user.ship.created);
    var minutes_repair = (((per_data.getFullYear()-1970)*365 + per_data.getMonth()*30 + (per_data.getDate()-1))*24 + (per_data.getHours()-3))*60 + per_data.getMinutes();

    var team = ship[user.ship.index_ship].team;

    if(user.ship.hull < ship[user.ship.index_ship].hull){
      var hull_repair_minutes = (0.25 + 0.25*potions_true*0.01 + 0.25*abilities_true*0.01)*team;

      var hull_repair = ship[user.ship.index_ship].hull - user.ship.hull;

      var hull_minutes = Math.floor(hull_repair / hull_repair_minutes)+1;
      if(hull_minutes > minutes_repair)
        hull_repair = minutes_repair * hull_repair_minutes;

        user.ship.hull =  Math.floor(user.ship.hull + hull_repair);
  }

  if(user.ship.sails < ship[user.ship.index_ship].sails){
    var sails_repair_minutes = (0.3 + 0.3*potions_true*0.01 + 0.3*abilities_true*0.01)*team;

    var sails_repair = ship[user.ship.index_ship].sails - user.ship.sails;

    var sails_minutes = Math.floor(sails_repair / sails_repair_minutes)+1;
    if(sails_minutes > minutes_repair)
      sails_repair = minutes_repair * sails_repair_minutes;

      user.ship.sails = Math.floor(user.ship.sails + sails_repair);
  }

  user.ship.created = new Date;

};
