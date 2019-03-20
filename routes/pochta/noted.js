var Noted = require('../../models/noted').Noted;
var mongoose = require('../../libs/mongoose');
var AuthError_not = require('../../models/noted').AuthError_not;
var HttpError = require('../../error').HttpError;

exports.get = function (req, res, next) {
  var page = +req.query.page;

  Noted.find_noteds(req.user.username, function (err, noteds) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

      var noteds_poryadok = [noteds[0]];
      if (!noteds_poryadok) {
        noteds_poryadok = [0];
      }

      var position;
            for (var i = 1; i < noteds.length; i++) {
              position=noteds_poryadok.length;
              for (var j = 0; j < noteds_poryadok.length; j++) {
                  if (noteds_poryadok[j].created < noteds[i].created) {
                    position = j;
                    break;
                  }
              }
                noteds_poryadok.splice(position, 0, noteds[i]);

            }

      if (!noteds_poryadok[0]) {
        noteds_poryadok = [0];
      }

    var noteds_list = noteds_poryadok.length;
    if (page == 3 && noteds_list>20) {
      page = 3;
    } else if (page == 2 && noteds_list>10) {
      page = 2;
    } else {
      page = 1;
    }
    noteds_poryadok = noteds_poryadok.splice((page-1)*10, 10);

      res.render('./pochta/noted',{noteds: noteds_poryadok, page: page, noteds_list: noteds_list});
      });
};
