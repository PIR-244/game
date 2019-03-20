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
  message: {
    type: String,
    required:true
  },
  new_activ: {
    type: Number,
    required:true
  },
  created: {
    type: Date,
    required:true
  }
});

schema.statics.find_letters = function (username, callback) {
  var Letter = this;
    async.waterfall([
      function (callback) {
        if(!username) callback;
        Letter.find({ $or:[ {sender: username}, {recipient: username}]}, callback);
      }
    ], callback);
  }

schema.statics.find_letter = function (req_username, username, callback) {
    var Letter = this;
      async.waterfall([
        function (callback) {
          if(!username) callback;
          Letter.find({ sender: { $in: [req_username, username]}, recipient: { $in: [req_username, username]}}, callback);
        }
      ], callback);
    }


exports.Letter = mongoose.model('Letter', schema);

function AuthError_let( message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError_let);


  this.message = message;
}

util.inherits(AuthError_let, Error);

AuthError_let.prototype.name = 'AuthError_let';

exports.AuthError_let = AuthError_let;
