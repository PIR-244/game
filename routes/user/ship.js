var ship = require('../../middleware/game/ship').list_ships;
var guns = require('../../middleware/game/guns').list_guns;

exports.get = function (req, res, next) {
  var names_images = '';
  var alt_images = '';
  if (req.user.ship.guns.charge == 0) {
    names_images = 'yadra';
    alt_images = 'Ядра';
  } else   if (req.user.ship.guns.charge == 1) {
      names_images = 'kartech';
      alt_images = 'Картечь';
    } else   if (req.user.ship.guns.charge == 2) {
        names_images = 'knippeli';
        alt_images = 'Книппели';
      } else   if (req.user.ship.guns.charge == 3) {
          names_images = 'bomby';
          alt_images = 'Бомбы';
        }

  res.render('./user/ship', { ship: ship[req.user.ship.index_ship], guns: guns[req.user.ship.guns.funt_guns],
            names_images: names_images, alt_images: alt_images });
};
