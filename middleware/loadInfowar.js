
var Journal = require('../models/journal').Journal;

module.exports = function (req,res,next) {
  res.locals.info_war = null;
  //    Journal
  Journal.find({ sender: { $in: [req.user.username, req.user.war.user_war]}, recipient: { $in: [ req.user.username, req.user.war.user_war ]}, rating: { $ne: -1 }}, function (err, journals) {
    if (err) {
      if (err instanceof AuthError_journal) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }
      if (journals[0]) {
        for (var i = 0; i < journals.length; i++) {
          var date_now = new Date;
              if (date_now.getTime()/1000 < journals[i].created.getTime()/1000+120) {
                if (req.user.war.user_war != 'bot') {
                  res.locals.info_war = journals[i];
                  break;
                } else if (req.user.war.user_war == 'bot' && journals[i].bot_name == req.user.boti.username) {
                  res.locals.info_war = journals[i];
                  break;
                }
              }
          }
        }

        next();
    });
};
