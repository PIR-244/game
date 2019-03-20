var User = require('../models/user').User;
var mongoose = require('../libs/mongoose');

exports.get = function (req, res, next) {
  var page = +req.query.page;
  var info = req.query.info;
  if (info != 'rewards') {
    info = 0;
  }

  User.find({'rating.rating': { $ne: 0}},function (err, docs) {
    if (page == 3 && docs.length > 20) {
      page = 3;
    } else if (page == 2 && docs.length > 10) {
      page = 2;
    } else {
      page = 1;
    }
    var list;

    var poryadok = [docs[0]];
    var position;
    if (docs[0]) {
    list = docs.length;
    for (var i = 1; i < docs.length; i++) {
      position = 0;
      for (var j = 0; j < poryadok.length; j++) {
        if (poryadok[j].rating.rating > docs[i].rating.rating) {
          poryadok.splice(j, 0, docs[i]);
          position = 1;
          break;
        }
      }
      if (position == 0) {
        poryadok.push(docs[i]);
      }
    }

    poryadok = poryadok.splice((page-1)*10, 10);

      for (var i = 0; i < poryadok.length; i++) {
        poryadok[i].avatar_index += '_mini';
      }
    } else {
      poryadok = [0];
      list = 0;
    }

  res.render('reyting',{  page: page, poryadok: poryadok, info: info, list: list });
});
};
