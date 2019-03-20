var User = require('../../models/user').User;
var HttpError = require('../../error').HttpError;
var AuthError = require('../../models/user').AuthError;

exports.get = function (req, res,next) {
  var page = +req.query.page;
  var sex = req.query.sex;

  var err_message_low = '';
  var zaglav_sex = 'Мужские';
  var list_sex = 'Женские';
  var href_sex = 'male'
  var value_img = [];
  var requirement = [];
  var price = [];

  if (sex == 'female') {
    sex = 'female';
    zaglav_sex = 'Женские';
    list_sex = 'Мужские';
  } else {
    sex = 'male';
    href_sex = 'female'
  }

  if (page != 2) {
    page = 1;
    if (sex == 'male') {
      value_img[0] = '6';
      requirement[0] = '';
      price[0] = '250 песо';
      value_img[1] = '2';
      requirement[1] = '10';
      price[1] = '4250 песо';
      value_img[2] = '3';
      requirement[2] = '25';
      price[2] = '11400 песо';
    } else {
      value_img[0] = '11';
      requirement[0] = '';
      price[0] = '250 песо';
      value_img[1] = '7';
      requirement[1] = '10';
      price[1] = '4250 песо';
      value_img[2] = '12';
      requirement[2] = '25';
      price[2] = '11400 песо';
    }
  } else {
    if (sex == 'male') {
      value_img[0] = '1';
      requirement[0] = '38';
      price[0] = '15 золотых слитков';
      value_img[1] = '4';
      requirement[1] = '60';
      price[1] = '35 золотых слитков';
      value_img[2] = '5';
      requirement[2] = '96';
      price[2] = '80 золотых слитов';
    } else {
      value_img[0] = '9';
      requirement[0] = '38';
      price[0] = '15 золотых слитков';
      value_img[1] = '8';
      requirement[1] = '60';
      price[1] = '35 золотых слитков';
      value_img[2] = '10';
      requirement[2] = '96';
      price[2] = '80 золотых слитов';
    }
  }

res.render('./user/avatar',{ page: page, sex: sex, zaglav_sex: zaglav_sex, value_img: value_img, href_sex:href_sex,
            requirement: requirement, price: price, list_sex: list_sex, err_message_low: err_message_low });
};

exports.post = function (req, res,next) {
  var user_id = req.session.user;
  var val_img = req.body.value_img;
  var info_img = 0;
  var price_value_img = 'песо';

  var err_message_low = '';
  var zaglav_sex = 'Мужские';
  var list_sex = 'Женские';
  var href_sex = 'male'
  var value_img = [];
  var requirement = [];
  var price = [];
  var price_only_cena = []

  if (val_img =='7'|| val_img =='8'|| val_img =='9'|| val_img =='10'|| val_img =='11'|| val_img =='12') {
    sex = 'female';
    zaglav_sex = 'Женские';
    list_sex = 'Мужские';
  } else if (val_img =='1'|| val_img =='2'|| val_img =='3'|| val_img =='4'|| val_img =='5'|| val_img =='6'){
    sex = 'male';
    href_sex = 'female';
  } else {
    sex = 'male';
    href_sex = 'female';
    val_img = '6';
  }

  if (val_img =='6'|| val_img =='2'|| val_img =='3'|| val_img =='11'|| val_img =='7'|| val_img =='12') {
    page = 1;
    price_only_cena[0] = 250;
    price_only_cena[1] = 4250;
    price_only_cena[2] = 11400;
    if (sex == 'male') {
      if (val_img =='6') { info_img = 0; }
      value_img[0] = '6';
      requirement[0] = '';
      price[0] = '250 песо';
      if (val_img =='2') { info_img = 1; }
      value_img[1] = '2';
      requirement[1] = '10';
      price[1] = '4250 песо';
      if (val_img =='3') { info_img = 2; }
      value_img[2] = '3';
      requirement[2] = '25';
      price[2] = '11400 песо';
    } else {
      if (val_img =='11') { info_img = 0; }
      value_img[0] = '11';
      requirement[0] = '';
      price[0] = '250 песо';
      if (val_img =='7') { info_img = 1; }
      value_img[1] = '7';
      requirement[1] = '10';
      price[1] = '4250 песо';
      if (val_img =='12') { info_img = 2; }
      value_img[2] = '12';
      requirement[2] = '25';
      price[2] = '11400 песо';
    }
  } else {
    page = 2;
    price_only_cena[0] = 15;
    price_only_cena[1] = 35;
    price_only_cena[2] = 80;
    price_value_img = 'золотых слитков';
    if (sex == 'male') {
      if (val_img =='1') { info_img = 0; }
      value_img[0] = '1';
      requirement[0] = '38';
      price[0] = '15 золотых слитков';
      if (val_img =='4') { info_img = 1; }
      value_img[1] = '4';
      requirement[1] = '60';
      price[1] = '35 золотых слитков';
      if (val_img =='5') { info_img = 2; }
      value_img[2] = '5';
      requirement[2] = '96';
      price[2] = '80 золотых слитов';
    } else {
      if (val_img =='9') { info_img = 0; }
      value_img[0] = '9';
      requirement[0] = '38';
      price[0] = '15 золотых слитков';
      if (val_img =='8') { info_img = 1; }
      value_img[1] = '8';
      requirement[1] = '60';
      price[1] = '35 золотых слитков';
      if (val_img =='10') { info_img = 2; }
      value_img[2] = '10';
      requirement[2] = '96';
      price[2] = '80 золотых слитов';
    }
  }

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

      if (user.avatar_index != val_img) {
        if (requirement[info_img] <= user.skills.navigation) {
          var price_number_img = user.pesos;
          if (price_value_img == 'золотых слитков') { price_number_img = user.gold_bars; }
          if (price_only_cena[info_img] <= price_number_img) {
            if (price_value_img == 'песо') {
            res.locals.user.pesos =
              user.pesos = user.pesos - price_only_cena[info_img];
              res.locals.user.avatar_index =
              user.avatar_index = val_img;
            } else {
            res.locals.user.gold_bars =
              user.gold_bars = user.gold_bars - price_only_cena[info_img];
              res.locals.user.avatar_index =
              user.avatar_index = val_img;
            }
          } else { err_message_low = 'У вас недостаточно '+price_value_img+' для покупки!'; }
        } else { err_message_low = 'Требуемый уровень навигации: '+requirement[info_img]; }
      } else { err_message_low = 'У вас уже куплен данный аватар!'; }

      user.save(function (err) {
        if(err) return next(err);
    });

  res.render('./user/avatar',{ page: page, sex: sex, zaglav_sex: zaglav_sex, value_img: value_img, href_sex:href_sex,
            requirement: requirement, price: price, list_sex: list_sex, err_message_low: err_message_low });
          });
  };
