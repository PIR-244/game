var async = require('async');
var util = require('util');

var mongoose = require('../libs/mongoose'),
  Schema = mongoose.Schema;

var schema = new Schema({
  sender: {
    type: String
  },
  recipient: {
    type: String
  },
  damage_one: {
    type: Number
  },
  damage_two: {
    type: Number
  },
  charge: {
    type: Number
  },
  value_war: {
    type: Number
  },
  krit_true: {
    type: Number
  },
  team_res: {
    type: Number
  },
  created: {
    type: Date,
    default: Date.now
  }
});

    schema.statics.find_logs = function (username, enemy, callback) {
        var LogWar = this;
          async.waterfall([
            function (callback) {
              if(!username) callback;
              if(!enemy) callback;
              LogWar.find({ sender: { $in: [username, enemy]}, recipient: { $in: [ username, enemy ]}}, callback);
            }
          ], callback);
        }

exports.LogWar = mongoose.model('LogWar', schema);

function AuthError_logWar( message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError_logWar);


  this.message = message;
}

util.inherits(AuthError_logWar, Error);

AuthError_logWar.prototype.name = 'AuthError_logWar';

exports.AuthError_logWar = AuthError_logWar;
