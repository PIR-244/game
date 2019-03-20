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
  rating: {
    type: Number
  },
  value_war: {
    type: Number
  },
  number_one: {
    type: Number
  },
  reward: {
    type: Number
  },
  bot_name: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

schema.statics.find_journals = function (username, callback) {
    var Journal = this;
      async.waterfall([
        function (callback) {
          if(!username) callback;
          Journal.find({ $or:[ {sender: username}, {recipient: username}], rating: { $ne: -1 }}, callback);
        }
      ], callback);
    }

    schema.statics.find_journal = function (username, enemy, callback) {
        var Journal = this;
          async.waterfall([
            function (callback) {
              if(!username) callback;
              Journal.findOne({ sender: { $in: [username, enemy]}, recipient: { $in: [ username, enemy ]}, rating: -1}, callback);
            }
          ], callback);
        }

exports.Journal = mongoose.model('Journal', schema);

function AuthError_journal( message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError_journal);


  this.message = message;
}

util.inherits(AuthError_journal, Error);

AuthError_journal.prototype.name = 'AuthError_journal';

exports.AuthError_journal = AuthError_journal;
