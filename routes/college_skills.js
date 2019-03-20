var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;

exports.get = function (req, res,next) {
var err_message_low = '';

res.locals.max_number_marksmanship = Math.floor(Math.pow(req.user.skills.marksmanship+1, 2.66));
res.locals.price_marksmanship = res.locals.max_number_marksmanship - req.user.skills.number_marksmanship;

res.locals.max_number_protection = Math.floor(Math.pow(req.user.skills.protection+1, 2.55));
res.locals.price_protection = res.locals.max_number_protection - req.user.skills.number_protection;

res.locals.max_number_resistance = Math.floor(Math.pow(req.user.skills.resistance+1, 2.58));
res.locals.price_resistance = res.locals.max_number_resistance - req.user.skills.number_resistance;

res.locals.max_number_boarding = Math.floor(Math.pow(req.user.skills.boarding+1, 2.64));
res.locals.price_boarding = res.locals.max_number_boarding - req.user.skills.number_boarding;

res.locals.max_number_navigation = Math.floor(Math.pow(req.user.skills.navigation+1, 2.57));
res.locals.price_navigation = res.locals.max_number_navigation - req.user.skills.number_navigation;

res.render('college_skills', {err_message_low:err_message_low});
};

exports.post = function (req, res,next) {
  var value_skills = req.body.value_skills;
  var user_id = req.session.user;

  if (value_skills != 'marksmanship' && value_skills != 'protection' && value_skills != 'resistance'
      && value_skills != 'boarding' && value_skills != 'navigation') {
    value_skills = 'marksmanship';
  }
  var objs_pow = { marksmanship: 2.66, protection: 2.55, resistance: 2.58, boarding: 2.64, navigation: 2.57 };
  var err_message_low = '';

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

      if (user.ship.plavanie == 0) {
        Object.keys(user.skills).forEach(function (keys) {
          if (value_skills == keys) {
            if (Math.floor(Math.pow(user.skills[keys]+1, objs_pow[keys]))-user.skills['number_'+keys] <= user.pesos) {
              if (user.bank.credit.number_credit <= 0) {

              user.pesos=user.pesos-(Math.floor(Math.pow(user.skills[keys]+1, objs_pow[keys]))-user.skills['number_'+keys]);
              user.skills[keys] = user.skills[keys]+1;
              user.skills['number_'+keys] = 0;

              // TRAINING
              if (user.training == 12) {
                if (user.skills.marksmanship >= 5 && user.skills.protection >= 5 && user.skills.resistance >= 5 && user.skills.boarding >= 5 && user.skills.navigation >= 5) {
                  user.training++;
                }
              }

              if (keys == 'navigation') {
                var ship_update = require('../middleware/game/ship_update');
                ship_update.Ship_update(user);
              }
            } else { err_message_low = 'Отдайте сначала свой долг в банке!' }
            } else { err_message_low = 'Недостаточно песо для улучшения навыка!' }
          }
        });
      } else { err_message_low = 'Вы находитесь в плавании!' }

      user.save(function (err) {
        if(err) return next(err);
    });
    res.locals.user = user;

    res.locals.max_number_marksmanship = Math.floor(Math.pow(user.skills.marksmanship+1, 2.66));
    res.locals.price_marksmanship = res.locals.max_number_marksmanship - user.skills.number_marksmanship;

    res.locals.max_number_protection = Math.floor(Math.pow(user.skills.protection+1, 2.55));
    res.locals.price_protection = res.locals.max_number_protection - user.skills.number_protection;

    res.locals.max_number_resistance = Math.floor(Math.pow(user.skills.resistance+1, 2.58));
    res.locals.price_resistance = res.locals.max_number_resistance - user.skills.number_resistance;

    res.locals.max_number_boarding = Math.floor(Math.pow(user.skills.boarding+1, 2.64));
    res.locals.price_boarding = res.locals.max_number_boarding - user.skills.number_boarding;

    res.locals.max_number_navigation = Math.floor(Math.pow(user.skills.navigation+1, 2.57));
    res.locals.price_navigation = res.locals.max_number_navigation - user.skills.number_navigation;

res.render('college_skills', {err_message_low:err_message_low});
    });
};
