var mongoose = require('mongoose');
var config = require('../config')

/*var a;
  mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:keepAlive'));
      /*timerId = setInterval(function () {
        a=0;
          mongoose.connection.on('error', function () {
            console.log(1);
            a = 1;
      });
      setTimeout(function (){
        if(a == 0){
        clearInterval(timerId);
        console.log(423);
      }
    }, 10000);
  }, 1000);*/

  var options = {
    autoReconnect: true
  };

  var timerId = setInterval(function () {
  mongoose.connect(config.get('mongoose:uri'), options, function (err) {
    if (err) { }
    else {
      clearInterval(timerId);
    }
  });
}
, 5000);

module.exports = mongoose;
