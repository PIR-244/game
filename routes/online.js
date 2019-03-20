var User = require('../models/user').User;
var mongoose = require('../libs/mongoose');

exports.get = function (req, res, next) {
  var page = +req.query.page;

  User.find({ online: 1},function (err, docs) {

var list;

    var poryadok = [docs[0]];
    if (docs[0]) {
      list = Math.ceil(docs.length/15);

          if (page > 1 && list >= page) {
            page = Math.floor(page);
          }else {
            page = 1;
          }
      var position;
      for (var i = 1; i < docs.length; i++) {
        position = 0;
        for (var j = 0; j < poryadok.length; j++) {
          if (poryadok[j].last_action < docs[i].last_action) {
            poryadok.splice(j, 0, docs[i]);
            position = 1;
            break;
          }
        }
        if (position == 0) {
          poryadok.push(docs[i]);
        }
      }

      poryadok = poryadok.splice((page-1)*15, 15);
    } else {
      poryadok = [0];
      list = 0;
    }

  res.render('online',{  page: page, poryadok: poryadok, list: list });
});
};
