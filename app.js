var express = require('express');
var http = require('http');
var path = require('path');
var errorHandler = require('errorhandler');
var config = require('./config');
var log = require('./libs/log')(module);
var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('./libs/mongoose');
var HttpError = require('./error').HttpError;
var session = require('express-session');

var app = express();
app.set('env', "production");

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, '/template'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (app.get('env') == 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
var MongoStore = require('connect-mongo')(session);
app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  resave: true,
  saveUninitialized: false,
  rolling: true,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));



app.use(require('./middleware/sendHttpError'));
app.use(express.Router());

require('./routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (err,req,res,next) {
  if(typeof err == 'number'){
    err = new HttpError(err);
  }

  if(err instanceof HttpError){
    res.sendHttpError(err);
  }else {
    if(app.get('env') == 'development'){
      var errorhandler = errorHandler();
      errorhandler( err,req,res,next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }

});


http.createServer(app).listen(config.get('port'), function () {
  log.info('Express server listening on port ' + config.get('port'));
});
