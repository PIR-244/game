var async = require('async');
var util = require('util');

var mongoose = require('../libs/mongoose'),
  Schema = mongoose.Schema;

var schema = new Schema({
  sender: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required:true
  }
});

schema.statics.find_noteds = function (username, callback) {
  var Noted = this;
    async.waterfall([
      function (callback) {
        if(!username) callback;
        Noted.find({sender: username}, callback);
      },
      function (noteds, callback) {
        if (noteds) {

            callback(null, noteds);
        } else {
            callback(null, 0);
        }
      }
    ], callback);
  }

schema.statics.find_noted = function (username, recipient, callback) {
    var Noted = this;
      async.waterfall([
        function (callback) {
          if(!username) callback;
          Noted.findOne({ sender: username, recipient: recipient }, callback);
        }
      ], callback);
    }


exports.Noted = mongoose.model('Noted', schema);

function AuthError_not( message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError_not);


  this.message = message;
}

util.inherits(AuthError_not, Error);

AuthError_not.prototype.name = 'AuthError_not';

exports.AuthError_not = AuthError_not;
