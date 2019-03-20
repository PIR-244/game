var abilities = require('../../middleware/game/abilities').abilities;

exports.get = function (req, res, next) {
  var names_images = [];
  var alt_images = [];

  if (req.user.abilities.damage_hull.activity > 0) {
    names_images.push('Korpus');
    alt_images.push(abilities.damage_hull.name);
  }
  if (req.user.abilities.damage_sails.activity > 0) {
    names_images.push('parus');
    alt_images.push(abilities.damage_sails.name);
  }
  if (req.user.abilities.damage_team.activity > 0) {
    names_images.push('komanda');
    alt_images.push(abilities.damage_team.name);
  }
  if (req.user.abilities.critical_shot.activity > 0) {
    names_images.push('krit');
    alt_images.push(abilities.critical_shot.name);
  }
  if (req.user.abilities.masters_boarding.activity > 0) {
    names_images.push('abordazh');
    alt_images.push(abilities.masters_boarding.name);
  }
  if (req.user.abilities.musket_volley.activity > 0) {
    names_images.push('zalp');
    alt_images.push(abilities.musket_volley.name);
  }
  if (req.user.abilities.protection_ship.activity > 0) {
    names_images.push('zaschita');
    alt_images.push(abilities.protection_ship.name);
  }
  if (req.user.abilities.quick_fix.activity > 0) {
    names_images.push('pochinka');
    alt_images.push(abilities.quick_fix.name);
  }
  if (req.user.abilities.improved_treatment.activity > 0) {
    names_images.push('lechenie');
    alt_images.push(abilities.improved_treatment.name);
  }
  if (req.user.abilities.speed_ship.activity > 0) {
    names_images.push('skorost');
    alt_images.push(abilities.speed_ship.name);
  }
  if (req.user.abilities.learnbility.activity > 0) {
    names_images.push('opyt');
    alt_images.push(abilities.learnbility.name);
  }
  if (req.user.abilities.maneuverability_ship.activity > 0) {
    names_images.push('manevrennost');
    alt_images.push(abilities.maneuverability_ship.name);
  }
  if (req.user.abilities.fast_recharge.activity > 0) {
    names_images.push('perezaryadka');
    alt_images.push(abilities.fast_recharge.name);
  }

var date_now = new Date;
if (req.user.potions.drug_intelligence.created > date_now) {
  names_images.push('intellekt');
  alt_images.push('Снадобье интеллекта');
}
if (req.user.potions.invigorating_rum.created > date_now) {
  names_images.push('rom');
  alt_images.push('Бодрящий ром');
}
if (req.user.potions.bottle_repairman.created > date_now) {
  names_images.push('remont');
  alt_images.push('Бутыль ремонтника');
}
if (req.user.potions.beverage_accuracy.created > date_now) {
  names_images.push('metkost');
  alt_images.push('Напиток меткости');
}

  res.render('./user/user', { names_images: names_images, alt_images: alt_images });
};
