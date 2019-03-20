
exports.get = function (req, res, next) {
  var err_status_low = +req.query.err_status_low;

var err_message_low = '';
  if (err_status_low==1){
    err_message_low = 'У вас недостаточно золотых слитков!';
  }
  else if (err_status_low==2){
    err_message_low = 'У вас недостаточно песо!';
  }
  else if (err_status_low==3){
    err_message_low = 'Вам отказано в получении кредита!';
  }
  else if (err_status_low==4){
    err_message_low = 'Вы находитесь в плавании!';
  }

  var number_credit = 0;
    if (req.user.ship.index_ship == 0) {
    number_credit = 500;
    } else if (req.user.ship.index_ship == 1) {
    number_credit = 1500;
    } else if (req.user.ship.index_ship == 2) {
    number_credit = 2200;
    } else if (req.user.ship.index_ship == 3) {
    number_credit = 4000;
    } else if (req.user.ship.index_ship==4||req.user.ship.index_ship==5||req.user.ship.index_ship==6) {
    number_credit = 5400;
    } else if (req.user.ship.index_ship==7||req.user.ship.index_ship==8||req.user.ship.index_ship==9) {
    number_credit = 8200;
    } else if (req.user.ship.index_ship==10||req.user.ship.index_ship==11||req.user.ship.index_ship==12) {
    number_credit = 12000;
    }
res.locals.number_credit = number_credit;

var credit_true = 0;
if (req.user.pesos < number_credit*0.5 && req.user.bank.storage.slot1.number_pesos <= 0
     && req.user.bank.storage.slot2.number_pesos <= 0 && req.user.bank.storage.slot3.number_pesos <= 0) {
  credit_true = 1;
}
res.locals.credit_true = credit_true;

  res.render('bank', {err_message_low:err_message_low});
};
