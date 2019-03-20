var abilities = require('../middleware/game/abilities').abilities;

exports.get = function (req, res, next) {
  var err_status_low = +req.query.err_status_low;
  var value_abilities = req.query.value_abilities;

  var err_message_low = '';
    if (err_status_low==1){
      err_message_low = 'У вас недостаточно золотых слитков!';
    }
    else if (err_status_low==2){
      err_message_low = 'У вас не хватает очков рейтинга!';
    }
    else if (err_status_low==3){
      err_message_low = 'У вас уже прокачана данная способность на этот уровень!';
    }    else if (err_status_low==4){
          err_message_low = 'Вы находитесь в плавании!';
        }

var ability_message = '&#160;';
var proc_s = '%';
var ability_message_low = '&#160;';
var value_img = 'perezaryadka';
if (value_abilities == 'damage_hull') {
  ability_message = 'Урон по корпусу вражесского корабля увеличивается';
  proc_s = '%';
  value_img = 'Korpus';
  ability_message_low = 'Урон увеличивается на';}
else if (value_abilities == 'damage_sails') {
  ability_message = 'Урон по парусам вражесского корабля увеличивается';
  proc_s = '%';
  value_img = 'parus';
  ability_message_low = 'Урон увеличивается на';
}
else if (value_abilities == 'damage_team') {
  ability_message = 'Урон по команде вражесского корабля увеличивается';
  proc_s = '%';
  value_img = 'komanda';
  ability_message_low = 'Урон увеличивается на';
}
else if (value_abilities == 'critical_shot') {
  ability_message = 'Шанс нанести критический выстрел по вражескому кораблю увеличивается';
  proc_s = '%';
  value_img = 'krit';
  ability_message_low = 'Шанс увеличивается на';
}
else if (value_abilities == 'masters_boarding') {
  ability_message = 'Эффективность вашей команды в ближнем бою увеличивается';
  proc_s = '%';
  value_img = 'abordazh';
  ability_message_low = 'Эффективность повышается на';
}
else if (value_abilities == 'musket_volley') {
  ability_message = 'Перед абордажем производится мушкетный залп, который наносит повреждения команде противника, но не более чем число стреляющих!';
  proc_s = '% вражеской команды';
  value_img = 'zalp';
  ability_message_low = 'Погибает';
}
else if (value_abilities == 'protection_ship') {
  ability_message = 'Увеличивает прочность вашего корабля';
  proc_s = '%';
  value_img = 'zaschita';
  ability_message_low = 'Прочность увеличивается на';
}
else if (value_abilities == 'quick_fix') {
  ability_message = 'Скорость починки вашего корабля увеличивается';
  proc_s = '%';
  value_img = 'pochinka';
  ability_message_low = 'Скорость увеличивается на';
}
else if (value_abilities == 'improved_treatment') {
  ability_message = 'Повышает количество раненых, которых можно вылечить и вернуть обратно в строй';
  proc_s = '% к базовому лечению';
  value_img = 'lechenie';
  ability_message_low = 'Прибавляет'; //Количество вылеченных увеличивается на
}
else if (value_abilities == 'speed_ship') {
  ability_message = 'Скорость корабля увеличивается';
  proc_s = '%';
  value_img = 'skorost';
  ability_message_low = 'Скорость увеличивается на';
}
else if (value_abilities == 'learnbility') {
  ability_message = 'Позволяет в плавании получать больше опыта';
  proc_s = '%';
  value_img = 'opyt';
  ability_message_low = 'Количество опыта увеличивается на';
}
else if (value_abilities == 'maneuverability_ship') {
  ability_message = 'Повышает маневренность вашего корабля';
  proc_s = '%';
  value_img = 'manevrennost';
  ability_message_low = 'Маневренность увеличивается на';
}
else {
  ability_message = 'Время перезарядки орудий уменьшается';
  proc_s = '%';
  ability_message_low = 'Время перезарядки уменьшается на';
  value_abilities = 'fast_recharge';
}

var ability_level = req.user.abilities[value_abilities].level;
var ability = abilities[value_abilities];
    res.render('college_abilities_info', {err_message_low:err_message_low, ability: ability,
                ability_level: ability_level, ability_message: ability_message, proc_s: proc_s,
            value_img: value_img, ability_message_low: ability_message_low, value_abilities: value_abilities});
};
