var User = require('./models/user').User;
var mongoose = require('./libs/mongoose');

mongoose.connection.once('open', function () {
  User.find({username: 'name1'},function (err, user) {
    if (err) throw err;

    user.pesos += 10000;
    user.gold_bars += 5;

    user.save(function (err) {
      if (err) throw err;
    });
  });
});
