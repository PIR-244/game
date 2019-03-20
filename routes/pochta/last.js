var Letter = require('../../models/letter').Letter;
var mongoose = require('../../libs/mongoose');
var AuthError_let = require('../../models/letter').AuthError_let;

exports.get = function (req, res, next) {
  var page = +req.query.page;

  Letter.find_letters(req.user.username, function (err, letters) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }

var letters_poryadok = [letters[0]];
var no_spisok_schet;
var position;
var false_povtor;
      for (var i = 1; i < letters.length; i++) {
        no_spisok_schet = 0;
        false_povtor=0;
        position=letters_poryadok.length;
        for (var j = 0; j < letters_poryadok.length; j++) {
          if (letters_poryadok[j].sender == letters[i].sender && letters[i].sender != req.user.username ||
            letters_poryadok[j].sender == letters[i].recipient && letters[i].recipient != req.user.username ||
            letters_poryadok[j].recipient == letters[i].sender && letters[i].sender != req.user.username ||
            letters_poryadok[j].recipient == letters[i].recipient && letters[i].recipient != req.user.username) {
              if (letters_poryadok[j].created < letters[i].created) {
                letters_poryadok[j] = letters[i];
              }
          } else {
            no_spisok_schet++;
            if (letters_poryadok[j].created < letters[i].created && false_povtor != 1) {
              position = j;
              false_povtor=1;
            }
          }
        }
        if (no_spisok_schet == letters_poryadok.length) {
          letters_poryadok.splice(position, 0, letters[i]);
        }
      }

      if (!letters_poryadok[0]) {
        letters_poryadok = [0];
      }

      var letters_poryadok_2 = [letters_poryadok[0]];
      for (var i = 1; i < letters_poryadok.length; i++) {
        position=letters_poryadok_2.length;
        for (var j = 0; j < letters_poryadok_2.length; j++) {
            if (letters_poryadok_2[j].created < letters_poryadok[i].created) {
              position = j;
              break;
            }
        }

          letters_poryadok_2.splice(position, 0, letters_poryadok[i]);

      }

    var letters_list = letters_poryadok.length;
    if (page == 3 && letters_list>20) {
      page = 3;
    } else if (page == 2 && letters_list>10) {
      page = 2;
    } else {
      page = 1;
    }
    letters_poryadok_2 = letters_poryadok_2.splice((page-1)*10, 10);

      res.render('./pochta/last',{letters: letters_poryadok_2, page: page, letters_list: letters_list});
      });
};
