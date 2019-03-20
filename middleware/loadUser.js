var User = require('../models/user').User;
var Letter = require('../models/letter').Letter;

module.exports = function (req,res,next) {
    req.user = res.locals.user = null;
    req.new_message = res.locals.new_message = null;
    req.message_activ = res.locals.message_activ = 'pochta2';
    res.locals.plavanie_message = null;

    if(!req.session.user) return next();

    User.findById(req.session.user, function (err, user) {
      if(err) return next(err);

      Letter.find({recipient: user.username, new_activ: 1}, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
          if (docs[i].created > user.last_action) {
            req.new_message = res.locals.new_message = 1;
          }
        }
        if (docs[0]) {
          req.message_activ = res.locals.message_activ = 'pochta1';
        }

        user.last_action = new Date;
        user.online = 1;
        user.online_day = 1;
        user.save(function (err) {
          if (err) return next(err);
        })

        if (user.ship.plavanie == 1) {
          if (user.war.activity_war == 0) {
            res.locals.plavanie_message = 1;
          } else if (user.war.activity_war == 1) {
            res.locals.plavanie_message = 2;
          } else if (user.war.activity_war == 2) {
            res.locals.plavanie_message = 3;
          } else if (user.war.activity_war == 3 || user.war.activity_war == 4 ||
                      user.war.activity_war == 5) {
            res.locals.plavanie_message = 4;
          } else if (user.war.activity_war == 6) {
            res.locals.plavanie_message = 5;
          }
        } else if (user.ship.plavanie == 2) {
          if (user.war.activity_war == 0) {
            res.locals.plavanie_message = 6;
          } else if (user.war.activity_war == 1) {
            res.locals.plavanie_message = 7;
          } else if (user.war.activity_war == 2) {
            res.locals.plavanie_message = 8;
          } else if (user.war.activity_war == 3) {
            res.locals.plavanie_message = 9;
          } else if (user.war.activity_war == 4) {
            res.locals.plavanie_message = 10;
          }
        }

      req.user = res.locals.user = user;
      next();
      });
    });
};
