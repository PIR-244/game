var User = require('../../models/user').User;
var HttpError = require('../../error').HttpError;
var AuthError = require('../../models/user').AuthError;
var abilities = require('../../middleware/game/abilities').abilities;

exports.get = function (req, res, next) {

  var err_message_low = '';

  var names_images = [];
  var alt_images = [];
  var value_snyat = [];

  if (req.user.abilities.damage_hull.activity > 0) {
    names_images.push('Korpus');
    alt_images.push(abilities.damage_hull.name);
    value_snyat.push('damage_hull');
  }
  if (req.user.abilities.damage_sails.activity > 0) {
    names_images.push('parus');
    alt_images.push(abilities.damage_sails.name);
    value_snyat.push('damage_sails');
  }
  if (req.user.abilities.damage_team.activity > 0) {
    names_images.push('komanda');
    alt_images.push(abilities.damage_team.name);
    value_snyat.push('damage_team');
  }
  if (req.user.abilities.critical_shot.activity > 0) {
    names_images.push('krit');
    alt_images.push(abilities.critical_shot.name);
    value_snyat.push('critical_shot');
  }
  if (req.user.abilities.masters_boarding.activity > 0) {
    names_images.push('abordazh');
    alt_images.push(abilities.masters_boarding.name);
    value_snyat.push('masters_boarding');
  }
  if (req.user.abilities.musket_volley.activity > 0) {
    names_images.push('zalp');
    alt_images.push(abilities.musket_volley.name);
    value_snyat.push('musket_volley');
  }
  if (req.user.abilities.protection_ship.activity > 0) {
    names_images.push('zaschita');
    alt_images.push(abilities.protection_ship.name);
    value_snyat.push('protection_ship');
  }
  if (req.user.abilities.quick_fix.activity > 0) {
    names_images.push('pochinka');
    alt_images.push(abilities.quick_fix.name);
    value_snyat.push('quick_fix');
  }
  if (req.user.abilities.improved_treatment.activity > 0) {
    names_images.push('lechenie');
    alt_images.push(abilities.improved_treatment.name);
    value_snyat.push('improved_treatment');
  }
  if (req.user.abilities.speed_ship.activity > 0) {
    names_images.push('skorost');
    alt_images.push(abilities.speed_ship.name);
    value_snyat.push('speed_ship');
  }
  if (req.user.abilities.learnbility.activity > 0) {
    names_images.push('opyt');
    alt_images.push(abilities.learnbility.name);
    value_snyat.push('learnbility');
  }
  if (req.user.abilities.maneuverability_ship.activity > 0) {
    names_images.push('manevrennost');
    alt_images.push(abilities.maneuverability_ship.name);
    value_snyat.push('maneuverability_ship');
  }
  if (req.user.abilities.fast_recharge.activity > 0) {
    names_images.push('perezaryadka');
    alt_images.push(abilities.fast_recharge.name);
    value_snyat.push('fast_recharge');
  }

var ability_message = [];
var value_img = [];
var value_nadet = [];
var zaglav_message = [];
if (req.user.abilities.damage_hull.level>0) {
  ability_message.push('Урон по корпусу вражесского корабля увеличивается на '+
                    abilities.damage_hull.levels_proc[req.user.abilities.damage_hull.level]+'%');
  value_img.push('Korpus');
  value_nadet.push('damage_hull');
  zaglav_message.push(abilities.damage_hull.name);
}
if (req.user.abilities.damage_sails.level>0) {
  ability_message.push('Урон по парусам вражесского корабля увеличивается на '+
                    abilities.damage_sails.levels_proc[req.user.abilities.damage_sails.level]+'%');
  value_img.push('parus');
  value_nadet.push('damage_sails');
  zaglav_message.push(abilities.damage_sails.name);
}
if (req.user.abilities.damage_team.level>0) {
  ability_message.push('Урон по команде вражесского корабля увеличивается на '+
                    abilities.damage_team.levels_proc[req.user.abilities.damage_team.level]+'%');
  value_img.push('komanda');
  value_nadet.push('damage_team');
  zaglav_message.push(abilities.damage_team.name);
}
if (req.user.abilities.critical_shot.level>0) {
  ability_message.push('Шанс нанести критический выстрел по вражескому кораблю повышается на '+
                    abilities.critical_shot.levels_proc[req.user.abilities.critical_shot.level]+'%');
  value_img.push('krit');
  value_nadet.push('critical_shot');
  zaglav_message.push(abilities.critical_shot.name);
}
if (req.user.abilities.masters_boarding.level>0) {
  ability_message.push('Эффективность вашей команды в ближнем бою увеличивается на '+
                    abilities.masters_boarding.levels_proc[req.user.abilities.masters_boarding.level]+'%');
  value_img.push('abordazh');
  value_nadet.push('masters_boarding');
  zaglav_message.push(abilities.masters_boarding.name);
}
if (req.user.abilities.musket_volley.level>0) {
 ability_message.push('Перед абордажем производится мушкетный залп по команде противника. Повреждения получают '+
                abilities.musket_volley.levels_proc[req.user.abilities.musket_volley.level]+'% вражеской команды');
  value_img.push('zalp');
  value_nadet.push('musket_volley');
  zaglav_message.push(abilities.musket_volley.name);
}
if (req.user.abilities.protection_ship.level>0) {
  ability_message.push('Увеличивает прочность вашего корабля на '+
                    abilities.protection_ship.levels_proc[req.user.abilities.protection_ship.level]+'%');
  value_img.push('zaschita');
  value_nadet.push('protection_ship');
  zaglav_message.push(abilities.protection_ship.name);
}
if (req.user.abilities.quick_fix.level>0) {
  ability_message.push('Скорость починки вашего корабля увеличивается на '+
                    abilities.quick_fix.levels_proc[req.user.abilities.quick_fix.level]+'%');
  value_img.push('pochinka');
  value_nadet.push('quick_fix');
  zaglav_message.push(abilities.quick_fix.name);
}
if (req.user.abilities.improved_treatment.level>0) {
  ability_message.push('Количество раненых, которых можно вылечить и вернуть обратно в строй увелилчивается на '+
                    abilities.improved_treatment.levels_proc[req.user.abilities.improved_treatment.level]+'%');
  value_img.push('lechenie');
  value_nadet.push('improved_treatment');
  zaglav_message.push(abilities.improved_treatment.name);
}
if (req.user.abilities.speed_ship.level>0) {
  ability_message.push('Скорость корабля увеличивается на '+
                    abilities.speed_ship.levels_proc[req.user.abilities.speed_ship.level]+'%');
  value_img.push('skorost');
  value_nadet.push('speed_ship');
  zaglav_message.push(abilities.speed_ship.name);
}
if (req.user.abilities.learnbility.level>0) {
  ability_message.push('Получаемый в плавании опыт увеличивается на '+
                    abilities.learnbility.levels_proc[req.user.abilities.learnbility.level]+'%');
  value_img.push('opyt');
  value_nadet.push('learnbility');
  zaglav_message.push(abilities.learnbility.name);
}
if (req.user.abilities.maneuverability_ship.level>0) {
  ability_message.push('Повышает маневренность вашего корабля на '+
                    abilities.maneuverability_ship.levels_proc[req.user.abilities.maneuverability_ship.level]+'%');
  value_img.push('manevrennost');
  value_nadet.push('maneuverability_ship');
  zaglav_message.push(abilities.maneuverability_ship.name);
}
if (req.user.abilities.fast_recharge.level>0) {
  ability_message.push('Время перезарядки орудий уменьшается на '+
                    abilities.fast_recharge.levels_proc[req.user.abilities.fast_recharge.level]+'%');
  value_img.push('perezaryadka');
  value_nadet.push('fast_recharge');
  zaglav_message.push(abilities.fast_recharge.name);
}

    res.render('./user/abilities', {err_message_low:err_message_low, ability_message: ability_message,
        value_img: value_img, names_images: names_images, alt_images: alt_images , value_nadet: value_nadet,
        value_snyat: value_snyat, zaglav_message: zaglav_message });
};









exports.post = function (req, res, next) {
  var value_sn = req.body.value_snyat;
  var value_nad = req.body.value_nadet;
  var user_id = req.session.user;

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

  var err_message_low = '';

  if (value_sn) {
    Object.keys(user.abilities).forEach(function (key) {
      if (value_sn == key) {
        user.abilities[value_sn].activity = 0;
        res.locals.user.abilities[value_sn] = user.abilities[value_sn];
      }
    });
  } else  if(value_nad){
    var act_val_abil = 0;
    Object.keys(user.abilities).forEach(function (key) {
      if (user.abilities[key].activity == 1) { act_val_abil++;}
    });
    if (act_val_abil < 3) {
      Object.keys(user.abilities).forEach(function (key) {
        if (value_nad == key) {
          var date_now = new Date();
          date_now = new Date(date_now - user.war.last_abilities_activity);
          var number_seconds = ((((date_now.getUTCFullYear()-1970)*365 +
              date_now.getUTCMonth()*30 + (date_now.getUTCDate()-1))*24 + date_now.getUTCHours())*60 +
              date_now.getUTCMinutes())*60 +date_now.getUTCSeconds();
          if (user.war.activity_war == 0 || user.war.activity_war == 6 || user.ship.plavanie == 0 || user.ship.plavanie != 0 && number_seconds >= 35) {
            user.abilities[value_nad].activity = 1;
            if (user.ship.plavanie != 0 && user.war.activity_war != 0 && user.war.activity_war != 6) {
              user.war.last_abilities_activity = new Date();
            }
            res.locals.user.abilities[value_nad] = user.abilities[value_nad];
          } else {
            number_seconds = 35 - number_seconds;
            err_message_low = 'В бою можно активировать способности раз в 35 секунд! Осталось: '+
                                number_seconds+'сек.';
          }
        }
      });
    } else {
      err_message_low = 'Одновременно могут быть активными не более 3 способностей!'
    }
  }

  var ship_update = require('../../middleware/game/ship_update');
  ship_update.Ship_update(user);
  user.save(function (err) {
    if(err) return next(err);
});

  var names_images = [];
  var alt_images = [];
  var value_snyat = [];

  if (user.abilities.damage_hull.activity > 0) {
    names_images.push('Korpus');
    alt_images.push(abilities.damage_hull.name);
    value_snyat.push('damage_hull');
  }
  if (user.abilities.damage_sails.activity > 0) {
    names_images.push('parus');
    alt_images.push(abilities.damage_sails.name);
    value_snyat.push('damage_sails');
  }
  if (user.abilities.damage_team.activity > 0) {
    names_images.push('komanda');
    alt_images.push(abilities.damage_team.name);
    value_snyat.push('damage_team');
  }
  if (user.abilities.critical_shot.activity > 0) {
    names_images.push('krit');
    alt_images.push(abilities.critical_shot.name);
    value_snyat.push('critical_shot');
  }
  if (user.abilities.masters_boarding.activity > 0) {
    names_images.push('abordazh');
    alt_images.push(abilities.masters_boarding.name);
    value_snyat.push('masters_boarding');
  }
  if (user.abilities.musket_volley.activity > 0) {
    names_images.push('zalp');
    alt_images.push(abilities.musket_volley.name);
    value_snyat.push('musket_volley');
  }
  if (user.abilities.protection_ship.activity > 0) {
    names_images.push('zaschita');
    alt_images.push(abilities.protection_ship.name);
    value_snyat.push('protection_ship');
  }
  if (user.abilities.quick_fix.activity > 0) {
    names_images.push('pochinka');
    alt_images.push(abilities.quick_fix.name);
    value_snyat.push('quick_fix');
  }
  if (user.abilities.improved_treatment.activity > 0) {
    names_images.push('lechenie');
    alt_images.push(abilities.improved_treatment.name);
    value_snyat.push('improved_treatment');
  }
  if (user.abilities.speed_ship.activity > 0) {
    names_images.push('skorost');
    alt_images.push(abilities.speed_ship.name);
    value_snyat.push('speed_ship');
  }
  if (user.abilities.learnbility.activity > 0) {
    names_images.push('opyt');
    alt_images.push(abilities.learnbility.name);
    value_snyat.push('learnbility');
  }
  if (user.abilities.maneuverability_ship.activity > 0) {
    names_images.push('manevrennost');
    alt_images.push(abilities.maneuverability_ship.name);
    value_snyat.push('maneuverability_ship');
  }
  if (user.abilities.fast_recharge.activity > 0) {
    names_images.push('perezaryadka');
    alt_images.push(abilities.fast_recharge.name);
    value_snyat.push('fast_recharge');
  }

var ability_message = [];
var value_img = [];
var value_nadet = [];
var zaglav_message = [];
if (user.abilities.damage_hull.level>0) {
  ability_message.push('Урон по корпусу вражесского корабля увеличивается на '+
                    abilities.damage_hull.levels_proc[user.abilities.damage_hull.level]+'%');
  value_img.push('Korpus');
  value_nadet.push('damage_hull');
  zaglav_message.push(abilities.damage_hull.name);
}
if (user.abilities.damage_sails.level>0) {
  ability_message.push('Урон по парусам вражесского корабля увеличивается на '+
                    abilities.damage_sails.levels_proc[user.abilities.damage_sails.level]+'%');
  value_img.push('parus');
  value_nadet.push('damage_sails');
  zaglav_message.push(abilities.damage_sails.name);
}
if (user.abilities.damage_team.level>0) {
  ability_message.push('Урон по команде вражесского корабля увеличивается на '+
                    abilities.damage_team.levels_proc[user.abilities.damage_team.level]+'%');
  value_img.push('komanda');
  value_nadet.push('damage_team');
  zaglav_message.push(abilities.damage_team.name);
}
if (user.abilities.critical_shot.level>0) {
  ability_message.push('Шанс нанести критический выстрел по вражескому кораблю повышается на '+
                    abilities.critical_shot.levels_proc[user.abilities.critical_shot.level]+'%');
  value_img.push('krit');
  value_nadet.push('critical_shot');
  zaglav_message.push(abilities.critical_shot.name);
}
if (user.abilities.masters_boarding.level>0) {
  ability_message.push('Эффективность вашей команды в ближнем бою увеличивается на '+
                    abilities.masters_boarding.levels_proc[user.abilities.masters_boarding.level]+'%');
  value_img.push('abordazh');
  value_nadet.push('masters_boarding');
  zaglav_message.push(abilities.masters_boarding.name);
}
if (user.abilities.musket_volley.level>0) {
 ability_message.push('Перед абордажем производится мушкетный залп по команде противника. Повреждения получают '+
                abilities.musket_volley.levels_proc[user.abilities.musket_volley.level]+'% вражеской команды');
  value_img.push('zalp');
  value_nadet.push('musket_volley');
  zaglav_message.push(abilities.musket_volley.name);
}
if (user.abilities.protection_ship.level>0) {
  ability_message.push('Увеличивает прочность вашего корабля на '+
                    abilities.protection_ship.levels_proc[user.abilities.protection_ship.level]+'%');
  value_img.push('zaschita');
  value_nadet.push('protection_ship');
  zaglav_message.push(abilities.protection_ship.name);
}
if (user.abilities.quick_fix.level>0) {
  ability_message.push('Скорость починки вашего корабля увеличивается на '+
                    abilities.quick_fix.levels_proc[user.abilities.quick_fix.level]+'%');
  value_img.push('pochinka');
  value_nadet.push('quick_fix');
  zaglav_message.push(abilities.quick_fix.name);
}
if (user.abilities.improved_treatment.level>0) {
  ability_message.push('Количество раненых, которых можно вылечить и вернуть обратно в строй увелилчивается на '+
                    abilities.improved_treatment.levels_proc[user.abilities.improved_treatment.level]+'%');
  value_img.push('lechenie');
  value_nadet.push('improved_treatment');
  zaglav_message.push(abilities.improved_treatment.name);
}
if (user.abilities.speed_ship.level>0) {
  ability_message.push('Скорость корабля увеличивается на '+
                    abilities.speed_ship.levels_proc[user.abilities.speed_ship.level]+'%');
  value_img.push('skorost');
  value_nadet.push('speed_ship');
  zaglav_message.push(abilities.speed_ship.name);
}
if (user.abilities.learnbility.level>0) {
  ability_message.push('Получаемый в плавании опыт увеличивается на '+
                    abilities.learnbility.levels_proc[user.abilities.learnbility.level]+'%');
  value_img.push('opyt');
  value_nadet.push('learnbility');
  zaglav_message.push(abilities.learnbility.name);
}
if (user.abilities.maneuverability_ship.level>0) {
  ability_message.push('Повышает маневренность вашего корабля на'+
                    abilities.maneuverability_ship.levels_proc[user.abilities.maneuverability_ship.level]+'%');
  value_img.push('manevrennost');
  value_nadet.push('maneuverability_ship');
  zaglav_message.push(abilities.maneuverability_ship.name);
}
if (user.abilities.fast_recharge.level>0) {
  ability_message.push('Время перезарядки орудий уменьшается на '+
                    abilities.fast_recharge.levels_proc[user.abilities.fast_recharge.level]+'%');
  value_img.push('perezaryadka');
  value_nadet.push('fast_recharge');
  zaglav_message.push(abilities.fast_recharge.name);
}

    res.render('./user/abilities', {err_message_low:err_message_low, ability_message: ability_message,
        value_img: value_img, names_images: names_images, alt_images: alt_images , value_nadet: value_nadet,
        value_snyat: value_snyat, zaglav_message: zaglav_message });
      });
};
