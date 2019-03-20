var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;

exports.get = function (req, res, next) {
  var value_slot = req.query.value_slot;
  var number_pesos = req.query.number_pesos;


  if (value_slot === undefined) {
    value_slot = 0;
  }
  if (isNaN(value_slot)) {
    value_slot = 0;
  }
  if (value_slot != 0 && value_slot != 1 && value_slot != 2 && value_slot != 3 && value_slot != 4) {
    value_slot = 0;
  }

  if (number_pesos === undefined) {
    number_pesos = 0;
  }
  if (isNaN(number_pesos)) {
    number_pesos = 0;
  }
  if (number_pesos.length == 0) {
    number_pesos = 0;
  }
  if (+number_pesos > 0) { }
  else {
    number_pesos = 0;
  }
  number_pesos = Math.floor(number_pesos);

  var verificy_message = '';
  if (value_slot==3) {
    if (req.user.ship.index_ship == 0) {
    number_pesos = 500;
    } else if (req.user.ship.index_ship == 1) {
    number_pesos = 1500;
    } else if (req.user.ship.index_ship == 2) {
    number_pesos = 2200;
    } else if (req.user.ship.index_ship == 3) {
    number_pesos = 4000;
    } else if (req.user.ship.index_ship==4||req.user.ship.index_ship==5||req.user.ship.index_ship==6) {
    number_pesos = 5400;
    } else if (req.user.ship.index_ship==7||req.user.ship.index_ship==8||req.user.ship.index_ship==9) {
    number_pesos = 8200;
    } else if (req.user.ship.index_ship==10||req.user.ship.index_ship==11||req.user.ship.index_ship==12) {
    number_pesos = 12000;
    }
    if (req.user.pesos < number_pesos*0.5 && req.user.bank.storage.slot1.number_pesos <= 0
         && req.user.bank.storage.slot2.number_pesos <= 0
          && req.user.bank.storage.slot3.number_pesos <= 0) {
      verificy_message = 'взять в долг '+number_pesos+' песо'; }
      else { value_slot = 0; number_pesos = 0; }
  } else if (value_slot==4) {
    if (req.user.bank.credit.number_credit > 0) {
      verificy_message = 'вернуть банку '+req.user.bank.credit.number_credit+' песо'; }
      else { value_slot = 0;}
  }

  if (value_slot==0) {
    if (req.user.bank.storage.slot1.activity == 0) {
      verificy_message = 'открыть слот за 15 золотых слитков' }
    else if (req.user.bank.storage.slot1.number_pesos <= 0) {
      verificy_message = 'вложить '+number_pesos+' песо' }
    else {
      verificy_message = 'снять '+req.user.bank.storage.slot1.number_pesos+' песо' }
  }
  else if (value_slot==1) {
    if (req.user.bank.storage.slot2.activity == 0) {
      verificy_message = 'открыть слот за 50 золотых слитков' }
    else if (req.user.bank.storage.slot2.number_pesos <= 0) {
      verificy_message = 'вложить '+number_pesos+' песо' }
    else {
      verificy_message = 'снять '+req.user.bank.storage.slot2.number_pesos+' песо' }
  }
  else if (value_slot==2) {
    if (req.user.bank.storage.slot3.activity == 0) {
      verificy_message = 'открыть слот за 150 золотых слитков' }
    else if (req.user.bank.storage.slot3.number_pesos <= 0) {
      verificy_message = 'вложить '+number_pesos+' песо' }
    else {
      verificy_message = 'снять '+req.user.bank.storage.slot1.number_pesos+' песо' }
  }


  res.render('bank_confirmation', {number_pesos: number_pesos, value_slot: value_slot,
                verificy_message: verificy_message});
};

exports.post = function (req, res, next) {
  var user_id = req.session.user;
  var value_slot = req.body.value_slot;
  var number_pesos = req.body.number_pesos;


  if (value_slot === undefined) {
    value_slot = 0;
  }
  if (isNaN(value_slot)) {
    value_slot = 0;
  }
  if (value_slot != 0 && value_slot != 1 && value_slot != 2 && value_slot != 3 && value_slot != 4) {
    value_slot = 0;
  }

  if (number_pesos === undefined) {
    number_pesos = 0;
  }
  if (isNaN(number_pesos)) {
    number_pesos = 0;
  }
  if (number_pesos.length == 0) {
    number_pesos = 0;
  }
  if (+number_pesos > 0) { }
  else {
    number_pesos = 0;
  }
  number_pesos = Math.floor(number_pesos);
var err_status_low = 0;

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

      if (user.ship.plavanie == 0) {
        if (value_slot==0) {
          if (user.bank.storage.slot1.activity == 0) {
            if (user.gold_bars >= 15) {
              user.gold_bars = user.gold_bars - 15;
              user.bank.storage.slot1.activity = 1;

              // TRAINING
              if (user.training == 17) {
                user.training++;
              }

            } else {
              err_status_low = 1;
            }}
          else if (user.bank.storage.slot1.number_pesos <= 0) {
            if (user.pesos >= number_pesos) {
              if (number_pesos >= 2) {
                user.pesos = user.pesos - number_pesos;
                user.bank.storage.slot1.number_pesos = Math.floor(number_pesos*0.9);
                }
            } else {
              err_status_low = 2;
            }}
          else {
          user.pesos = user.pesos + user.bank.storage.slot1.number_pesos;
          user.bank.storage.slot1.number_pesos = 0; }
        }
        else if (value_slot==1) {
          if (user.bank.storage.slot2.activity == 0) {
            if (user.gold_bars >= 50) {
              user.gold_bars = user.gold_bars - 50;
              user.bank.storage.slot2.activity = 1;
            } else {
              err_status_low = 1;
            }}
          else if (user.bank.storage.slot2.number_pesos <= 0) {
            if (user.pesos >= number_pesos) {
              if (number_pesos >= 2) {
                user.pesos = user.pesos - number_pesos;
                user.bank.storage.slot2.number_pesos = Math.floor(number_pesos*0.9);
                }
            } else {
              err_status_low = 2;
            }}
          else {
          user.pesos = user.pesos + user.bank.storage.slot2.number_pesos;
          user.bank.storage.slot2.number_pesos = 0; }
        }
        else if (value_slot==2) {
          if (user.bank.storage.slot3.activity == 0) {
            if (user.gold_bars >= 150) {
              user.gold_bars = user.gold_bars - 150;
              user.bank.storage.slot3.activity = 1;
            } else {
              err_status_low = 1;
            }}
          else if (user.bank.storage.slot3.number_pesos <= 0) {
            if (user.pesos >= number_pesos) {
              if (number_pesos >= 2) {
                user.pesos = user.pesos - number_pesos;
                user.bank.storage.slot3.number_pesos = Math.floor(number_pesos*0.9);
                }
            } else {
              err_status_low = 2;
            }}
          else {
          user.pesos = user.pesos + user.bank.storage.slot3.number_pesos;
          user.bank.storage.slot3.number_pesos = 0; }
        }
        else if (value_slot==3) {
          if (user.ship.index_ship == 0) {
          number_pesos = 500;
          } else if (user.ship.index_ship == 1) {
          number_pesos = 1500;
          } else if (user.ship.index_ship == 2) {
          number_pesos = 2200;
          } else if (user.ship.index_ship == 3) {
          number_pesos = 4000;
          } else if (user.ship.index_ship==4||user.ship.index_ship==5||user.ship.index_ship==6) {
          number_pesos = 5400;
          } else if (user.ship.index_ship==7||user.ship.index_ship==8||user.ship.index_ship==9) {
          number_pesos = 8200;
          } else if (user.ship.index_ship==10||user.ship.index_ship==11||user.ship.index_ship==12) {
          number_pesos = 12000;
          }
          if (user.pesos < number_pesos*0.5 && user.bank.storage.slot1.number_pesos <= 0
             && user.bank.storage.slot2.number_pesos <= 0  && user.bank.storage.slot3.number_pesos <= 0) {
            user.bank.credit.number_credit = user.bank.credit.number_credit + number_pesos;
            user.pesos = user.pesos + number_pesos; }
            else { err_status_low = 3; }
        } else if (value_slot == 4) {
          if (user.bank.credit.number_credit > 0) {
            if (user.pesos >= user.bank.credit.number_credit) {
              user.pesos = user.pesos - user.bank.credit.number_credit;
              user.bank.credit.number_credit = 0; }
            else { err_status_low = 2; }}
        }
      }else { err_status_low = 4; }


      user.save(function (err) {
        if(err) return next(err);
    });
        res.json(err_status_low);
      });
}
