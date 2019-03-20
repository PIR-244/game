var abilities = require('./abilities').abilities;

module.exports.Treatment_battle = function (req, rip_team, user) {
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
  req.rip_team = rip_team;
};


module.exports.Treatment_battle_bot = function (req, rip_team, user) {
  /*var abilities_treatment = 0;
  Object.keys(user.boti.abilities).forEach(function (key) {
    if (user.boti.abilities[key].name == 'improved_treatment' && user.boti.abilities[key].level>0) {
      abilities_treatment =
          abilities.improved_treatment.levels_proc[user.boti.abilities[key].level]/100;
    }
  });*/

  var treatment = Math.floor(rip_team*(0.1/*+abilities_treatment*/));
  if (treatment > user.boti.ship.supplies.drugs) {
    treatment = user.boti.ship.supplies.drugs;
  }

  user.boti.ship.supplies.drugs = user.boti.ship.supplies.drugs - treatment;
  rip_team = rip_team - treatment;
  req.rip_team = rip_team;

};
