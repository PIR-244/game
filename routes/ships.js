var ship = require('../middleware/game/ship').list_ships;

exports.get = function (req, res, next) {
  var err_status_low = +req.query.err_status_low;
  var value_ships = +req.query.value_ships;
  var url_ships = req.url;
  var url_array = url_ships.split("?");

  if (url_array[0] == '/verf/ships_5') {
    url_ships = 'ships_5';
  } else if (url_array[0] == '/verf/ships_4') {
    url_ships = 'ships_4';
  } else if (url_array[0] == '/verf/ships_3') {
    url_ships = 'ships_3';
  } else {
    url_ships = 'ships_light';
  }
  if (value_ships != 0 && value_ships != 1 && value_ships != 2 && value_ships != 3 && value_ships != 4
       && value_ships != 5 && value_ships != 6 && value_ships != 7 && value_ships != 8
       && value_ships != 9 && value_ships != 10 && value_ships != 11 && value_ships != 12) {
    value_ships = 0;
  }

var err_message_low = '';
  if (err_status_low==1){
    err_message_low = 'У вас недостаточно песо!';
  }
  else if (err_status_low==2){
    err_message_low = 'Превышен лимит трюма на покупаемом корабле!';
  }
  else if (err_status_low==3){
    err_message_low = 'У вас уже куплено данное судно!';
  }
  else if (err_status_low==4){
    err_message_low = 'Отдайте сначала свой долг в банке!';
  }
  else if (err_status_low==5){
    err_message_low = 'Максимально допустимое количество команды на покупаемом корабле: '+ ship[value_ships].team;
  }
  else if (err_status_low==6){
    err_message_low = 'Максимально допустимое количество орудий на покупаемом корабле: '+ ship[value_ships].guns.number_guns;
  }
  else if (err_status_low==7){
    err_message_low = 'На данном корабле могут быть установлены орудия до '+ ship[value_ships].guns.funt_guns +' фунтов!';
  }
  else if (err_status_low==8){
    err_message_low = 'Вы еще недостаточно опытны чтобы совладать с данным судном!';
  }
  else if (err_status_low==9){
    err_message_low = 'Вы находитесь в плавании!';
  }
  else {
    err_status_low = 0;
  }



    res.render(url_ships, {err_message_low:err_message_low, err_status_low: err_status_low, ship: ship});
};
