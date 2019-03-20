var potions = require('../../middleware/game/potions').potions;
var User = require('../../models/user').User;
var HttpError = require('../../error').HttpError;
var AuthError = require('../../models/user').AuthError;

exports.get = function (req, res, next) {
var names_images = [];
var alt_images = [];
var potions_message_part1 = [];
var potions_message_part2 = [];
var value_potions = [];

var date_now = new Date;
if (req.user.potions.drug_intelligence.created > date_now || req.user.potions.drug_intelligence.number > 0) {
  names_images.push('intellekt');
  alt_images.push('Снадобье интеллекта');
  potions_message_part1.push('Удваивает получаемый опыт');
  potions_message_part2.push(12);
  value_potions.push('drug_intelligence');
}
if (req.user.potions.invigorating_rum.created > date_now || req.user.potions.invigorating_rum.number > 0) {
  names_images.push('rom');
  alt_images.push('Бодрящий ром');
  potions_message_part1.push('Повышает навык абордажа на 50%');
  potions_message_part2.push(4);
  value_potions.push('invigorating_rum');
}
if (req.user.potions.bottle_repairman.created > date_now || req.user.potions.bottle_repairman.number > 0) {
  names_images.push('remont');
  alt_images.push('Бутыль ремонтника');
  potions_message_part1.push('Починка корабля идет в 1.5 раза быстрее');
  potions_message_part2.push(12);
  value_potions.push('bottle_repairman');
}
if (req.user.potions.beverage_accuracy.created > date_now || req.user.potions.beverage_accuracy.number > 0) {
  names_images.push('metkost');
  alt_images.push('Напиток меткости');
  potions_message_part1.push('Повышает меткость на 50%');
  potions_message_part2.push(4);
  value_potions.push('beverage_accuracy');
}

  res.render('./user/alchimik', { names_images: names_images, alt_images: alt_images, value_potions: value_potions,
      potions_message_part1: potions_message_part1, potions_message_part2: potions_message_part2});
};

exports.post = function (req, res, next) {
  var user_id = req.session.user;
  var value_pot = req.body.value_potions;

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

      var date_now = new Date;

      if (value_pot) {
        Object.keys(user.potions).forEach(function (key) {
          if (value_pot == key) {
            if (user.potions[value_pot].number>0) {
              var time_action = 12;
              if (value_pot == 'invigorating_rum' || value_pot == 'beverage_accuracy') {
                time_action = 4;

                // TRAINING
                if (user.training == 25) {
                  if (key == 'invigorating_rum') {
                    user.training++;
                  }
                }

              }
              if (user.potions[key].created>date_now) {
                var date_potions = new Date(user.potions[key].created);
                user.potions[value_pot].number = user.potions[value_pot].number - 1;
                user.potions[key].created = date_potions.setHours(date_potions.getHours()+time_action);
                res.locals.user.potions[value_pot] = user.potions[value_pot];
              } else {
                user.potions[value_pot].number = user.potions[value_pot].number - 1;
                user.potions[key].created = date_now.setHours(date_now.getHours() + time_action);
                res.locals.user.potions[value_pot] = user.potions[value_pot];
              }
            }
          }
        });
      }

      var ship_update = require('../../middleware/game/ship_update');
      ship_update.Ship_update(user);
      user.save(function (err) {
        if(err) return next(err);
    });
date_now = new Date;
var names_images = [];
var alt_images = [];
var potions_message_part1 = [];
var potions_message_part2 = [];
var value_potions = [];

if (user.potions.drug_intelligence.created > date_now || user.potions.drug_intelligence.number > 0) {
  names_images.push('intellekt');
  alt_images.push('Снадобье интеллекта');
  potions_message_part1.push('Удваивает получаемый опыт');
  potions_message_part2.push(12);
  value_potions.push('drug_intelligence');
}
if (user.potions.invigorating_rum.created > date_now || user.potions.invigorating_rum.number > 0) {
  names_images.push('rom');
  alt_images.push('Бодрящий ром');
  potions_message_part1.push('Повышает навык абордажа на 50%');
  potions_message_part2.push(4);
  value_potions.push('invigorating_rum');
}
if (user.potions.bottle_repairman.created > date_now || user.potions.bottle_repairman.number > 0) {
  names_images.push('remont');
  alt_images.push('Бутыль ремонтника');
  potions_message_part1.push('Починка корабля идет в 1.5 раза быстрее');
  potions_message_part2.push(12);
  value_potions.push('bottle_repairman');
}
if (user.potions.beverage_accuracy.created > date_now || user.potions.beverage_accuracy.number > 0) {
  names_images.push('metkost');
  alt_images.push('Напиток меткости');
  potions_message_part1.push('Повышает меткость на 50%');
  potions_message_part2.push(4);
  value_potions.push('beverage_accuracy');
}

  res.render('./user/alchimik', { names_images: names_images, alt_images: alt_images, value_potions: value_potions,
      potions_message_part1: potions_message_part1, potions_message_part2: potions_message_part2});
    });
};
