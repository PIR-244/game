var Letter = require('../../models/letter').Letter;
var mongoose = require('../../libs/mongoose');
var HttpError = require('../../error').HttpError;
var AuthError_let = require('../../models/letter').AuthError_let;

exports.get = function (req, res, next) {
  var username = 'Администрация';

    Letter.find_letter(req.user.username, username, function (err, letters) {
      if (err) {
        if (err instanceof AuthError_let) {
          return next(new HttpError(403, err.message));
        } else {
            return next(err);
        }
        }

        var letters_poryadok = [letters[0]];
        if (!letters_poryadok) {
          letters_poryadok = [0];
        }

        var position;
              for (var i = 1; i < letters.length; i++) {
                position=letters_poryadok.length;
                for (var j = 0; j < letters_poryadok.length; j++) {
                    if (letters_poryadok[j].created < letters[i].created) {
                      position = j;
                      break;
                    }
                }
                  letters_poryadok.splice(position, 0, letters[i]);

              }

              var err_message_low = 0;

              if (letters[0]) {
                for (var i = 0; i < letters.length; i++) {
                  if (letters[i].recipient == req.user.username && letters[i].new_activ == 1 &&
                      letters[i].sender == username) {
                    letters[i].new_activ = 0;
                    letters[i].save(function (err) {
                      if(err) return next(err);
                    });
                  }
                }
              }
              Letter.find({sender: { $ne: username }, recipient: req.user.username, new_activ: 1}, function (err, docs) {
                if (!docs[0]) {
                  req.message_activ = res.locals.message_activ = 'pochta2';
                }
                letters_poryadok = letters_poryadok.splice(0, 10);
                res.render('./pochta/support', { letters: letters_poryadok, err_message_low: err_message_low });
              });
      });

};

exports.post = function (req, res, next) {
  var username = 'Администрация';
  var message = req.body.message;

  if (username == req.user.username) {
    return next(new HttpError(403,"Действие невозможно!"));
  }


    Letter.find_letter(req.user.username, username, function (err, letters) {
      if (err) {
        if (err instanceof AuthError_let) {
          return next(new HttpError(403, err.message));
        } else {
            return next(err);
        }
        }

        var err_message_low = '';
        var letters_poryadok = [letters[0]];
        if (!letters_poryadok[0]) {
          letters_poryadok = [0];
        }

        var number_delete=0;
        var position;
              for (var i = 1; i < letters.length; i++) {
                position=letters_poryadok.length;
                for (var j = 0; j < letters_poryadok.length; j++) {
                    if (letters_poryadok[j].created < letters[i].created) {
                      position = j;
                      break;
                    }
                }
                  if (position==letters_poryadok.length) {
                    number_delete = position;
                  }
                  letters_poryadok.splice(position, 0, letters[i]);

              }

        if (message.length > 0) {
          if (message.length <= 250) {
            var date_now = new Date;
            var date_message = new Date(date_now.getTime()-10000);
            if(letters_poryadok[0]!=0) {
              for (var i = 0; i < letters_poryadok.length; i++) {
                if (letters_poryadok[i].sender == req.user.username) {
                date_message = new Date(letters_poryadok[i].created);
                break;
                }
              }
            }
            date_now = new Date(date_now - date_message);
            if (((((date_now.getUTCFullYear()-1970)*365 + date_now.getUTCMonth()*30 + (date_now.getUTCDate()-1))*24 +
                date_now.getUTCHours())*60 + date_now.getUTCMinutes())*60 +date_now.getUTCSeconds() >= 5) {
              if (letters_poryadok.length >= 10) {
                  letters[number_delete].sender = req.user.username;
                  letters[number_delete].recipient = username;
                  letters[number_delete].message = message;
                  letters[number_delete].new_activ = 1;
                  letters[number_delete].created = new Date;

                  letters[number_delete].save(function (err) {
                    if(err) return next(err);
                  });
                letters_poryadok.pop();
                letters_poryadok.unshift(letters[number_delete]);
              } else {
                var letter = new Letter({
                  sender: req.user.username,
                  recipient: username,
                  message: message,
                  new_activ: 1,
                  created: new Date
                });
                letter.save(function (err) {
                  if(err) return next(err);
                });
                if (letters_poryadok[0]!=0) {
                  letters_poryadok.unshift(letter);
                } else {
                  letters_poryadok[0] = letter;
                }
              }
            } else { err_message_low = 'Сообщение можно отправлять один раз в 5 секунд!'; }
          } else { err_message_low = 'Сообщение слишком длинное. Лимит 150 символов!'; }
        } else { err_message_low = 'Данные введены некорректно!'; }

        if (letters[0]) {
          for (var i = 0; i < letters.length; i++) {
            if (letters[i].recipient == req.user.username && letters[i].new_activ == 1 &&
                letters[i].sender == username) {
              letters[i].new_activ = 0;
              letters[i].save(function (err) {
                if(err) return next(err);
              });
            }
          }
        }

              letters_poryadok = letters_poryadok.splice(0, 10);
              Letter.find({sender: { $ne: username }, recipient: req.user.username, new_activ: 1}, function (err, docs) {
                if (!docs[0]) {
                  req.message_activ = res.locals.message_activ = 'pochta2';
                }

                  res.render('./pochta/support', { letters: letters_poryadok, err_message_low: err_message_low });
                });
      });

}
