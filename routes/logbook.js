var Journal = require('../models/journal').Journal;
var HttpError = require('../error').HttpError;
var AuthError_journal = require('../models/journal').AuthError_journal;
var async = require('async');

exports.get = function (req, res, next) {

  Journal.find_journals(req.user.username, function (err, journals) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
    }

    if (journals[0]) {
      var position = 0;
      var journals_poryadok = [];
      for (var i = 0; i < journals.length; i++) {
        for (var j = 0; j < journals_poryadok.length; j++) {
            if (journals_poryadok[j].created < journals[i].created) {
              position = j;
              break;
            }
        }
          journals_poryadok.splice(position, 0, journals[i]);
          position=journals_poryadok.length;
      }

      var page = +req.query.page;
      if (page>=1&& page<=10) {
        page = Math.floor(page);
      } else {
        page = 1;
      }

      if ((page-1)*10 >= journals_poryadok.length) {
        page = 1;
      }
      var max_journals = journals_poryadok.length;
      var poryadok = journals_poryadok;
      journals_poryadok = poryadok.splice((page-1)*10, 10);
    } else {
      var max_journals = 0;
      journals_poryadok = [];
      page = 1;
    }

    res.render('logbook', {journals_poryadok: journals_poryadok,
                            max_journals: max_journals, page:page});
  });

}
