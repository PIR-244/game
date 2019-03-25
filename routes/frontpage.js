var User = require('../models/user').User;
var mongoose = require('../libs/mongoose');

exports.get = function (req, res) {

  User.find({online: 1},function (err, docs) {
    if (!docs[0]) {
      docs[0]=0;
    }
    var online = docs.length;

  res.render('frontpage',{online: online});
});
};
