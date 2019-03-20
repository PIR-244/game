var User = require('../../models/user').User;
var HttpError = require('../../error').HttpError;
var AuthError = require('../../models/user').AuthError;

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


  res.render('./user/recharge', { names_images: names_images, alt_images: alt_images });
};









exports.post = function (req, res, next) {
  var value_zaryad = req.body.value_zaryad;
  var user_id = req.session.user;

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

      if (value_zaryad != 1 && value_zaryad != 2 && value_zaryad != 3) {
        value_zaryad = 0;
      }
      res.locals.user.ship.guns.charge = user.ship.guns.charge = value_zaryad;

      // TRAINING
      if (user.training == 3) {
        if (user.ship.guns.charge == 3) {
          user.training = 6;
          res.locals.user.training = user.training;
        }
      }

        user.war.last_recharge = new Date();
      user.save(function (err) {
        if(err) return next(err);
    });

      var names_images = '';
      var alt_images = '';
      if (user.ship.guns.charge == 0) {
        names_images = 'yadra';
        alt_images = 'Ядра';
      } else   if (user.ship.guns.charge == 1) {
          names_images = 'kartech';
          alt_images = 'Картечь';
        } else   if (user.ship.guns.charge == 2) {
            names_images = 'knippeli';
            alt_images = 'Книппели';
          } else   if (user.ship.guns.charge == 3) {
              names_images = 'bomby';
              alt_images = 'Бомбы';
            }


      res.render('./user/recharge', { names_images: names_images, alt_images: alt_images });
    });
    };
