
exports.get = function (req, res, next) {
  var err_status_low = +req.query.err_status_low;

var err_message_low = '';
  if (err_status_low==1){
    err_message_low = 'У вас недостаточно золотых слитков!';
  } else   if (err_status_low==2){
      err_message_low = 'Вы находитесьв плавании!';
    }

  res.render('alchimik', {err_message_low:err_message_low});
};
