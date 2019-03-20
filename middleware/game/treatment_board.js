var abilities = require('./abilities').abilities;

module.exports.Treatment_board = function (rip_team, user) {
  var abilities_treatment = 0;
  if (user.abilities.improved_treatment.activity == 1 && user.abilities.improved_treatment.level > 0) {
    abilities_treatment =
        abilities.improved_treatment.levels_proc[user.abilities.improved_treatment.level]/100;
  }
  var treatment = Math.floor(rip_team*(0.1+abilities_treatment));
  if (treatment > user.ship.supplies.drugs) {
    treatment = user.ship.supplies.drugs;
  }

  user.ship.supplies.drugs = user.ship.supplies.drugs - treatment;
  rip_team = rip_team - treatment;
  return rip_team;
};
