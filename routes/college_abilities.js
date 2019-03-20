var abilities = require('../middleware/game/abilities').abilities;

exports.get = function (req, res, next) {
  var url_ships = req.url;
  var url_array = url_ships.split("?");

  if (url_array[0] == '/college/attack_abilities') {
    url_ships = 'attack_abilities';
  } else if (url_array[0] == '/college/protection_abilities') {
    url_ships = 'protection_abilities';
  } else {
    url_ships = 'ship_abilities';
  }




    res.render(url_ships, { abilities: abilities});
};
