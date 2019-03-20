
exports.get = function (req, res, next) {
  var page = +req.query.page;
  var err_status_low = +req.query.err_status_low;
  if (page == 2) {
    page = 2;
  }else {
    page = 1;
  }
var err_message_low = '';
  if (err_status_low==1){
    err_message_low = 'У вас недостаточно песо!';
  }
  else if (err_status_low==2){
    err_message_low = 'Трюм корабля полон! Продайте ненужные товары';
  }
  else if (err_status_low==3){
    err_message_low = 'У вас нет столько товара для продажи!';
  }
  else if (err_status_low==4){
    err_message_low = 'Вы находитесь в плавании!';
  }
  else {
    err_status_low = 0;
  }
    res.render('shop', {page: page, err_status_low:err_status_low, err_message_low:err_message_low});
};
