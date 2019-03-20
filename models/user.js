var crypto = require('crypto');
var async = require('async');
var util = require('util');
var mongoose = require('../libs/mongoose'),
  Schema = mongoose.Schema;

var schema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required:true
  },
  salt: {
    type: String,
    required:true
  },
  created: {
    type: Date,
    required:true
  },
  gold_bars: {type: Number, required:true},
  pesos: {type: Number, required:true},
  training: {type: Number},
  promo: {
    end_promo: {type: Date},
    close_promo: {type: Date}
  },
  assignments: {
    shop: {
      name_port: {type: String, required:true},
      index_cargo: {type: Number, required:true},
      cargo: {type: Number, required:true},
      activity: {type: Number, required:true}
    },
    tavern: {
      name_port: {type: String, required:true},
      reward: {type: Number, required:true},
      activity: {type: Number, required:true}
    },
    residence: {
      name_pirates: {type: String, required:true},
      reward: {type: Number, required:true},
      activity: {type: Number, required:true}
    },
    index_ship: {type: Number, required:true},
    created: { type: Date, default: Date.now }
  },
  last_action: {type: Date, required:true},
  online: {type: Number, required:true},
  online_day: {type: Number, required:true},
  avatar_index: {type: String, required:true},
  ship: {
    index_ship: {type: Number, required:true},
    hull: {type: Number, required:true},
    sails: {type: Number, required:true},
    guns: {
      number_guns: {type: Number, required:true},
      funt_guns: {type: Number, required:true},
      charge: {type: Number, required:true}
    },
    created: {type: Date, required:true},
    plavanie: {type: Number, required:true},
    speed: {type: Number, required:true},
    mobility: {type: Number, required:true},
    hold: {type: Number, required:true},
    team: {
      sailors: {type: Number, required:true},
      boarders: {type: Number, required:true},
      gunners: {type: Number, required:true},
      created: {type: Date, required:true}
    },
    supplies: {
      core: {type: Number, required:true},
      buckshot: {type: Number, required:true},
      barshots: {type: Number, required:true},
      bombs: {type: Number, required:true},
      gunpowder: {type: Number, required:true},
      food: {type: Number, required:true},
      weapons: {type: Number, required:true},
      drugs: {type: Number, required:true}
    }
  },
  skills: {
    marksmanship: {type: Number, required:true},
    boarding: {type: Number, required:true},
    resistance: {type: Number, required:true},
    protection: {type: Number, required:true},
    navigation: {type: Number, required:true},
    number_marksmanship: {type: Number, required:true},
    number_boarding: {type: Number, required:true},
    number_resistance: {type: Number, required:true},
    number_protection: {type: Number, required:true},
    number_navigation: {type: Number, required:true}
  },
  abilities: {
    fast_recharge: {
      level: {type: Number, required:true},
      activity:{type: Number, required:true}
    },
    damage_hull: {
      level: {type: Number, required:true},
      activity:{type: Number, required:true}
    },
    damage_sails: {
      level: {type: Number, required:true},
      activity:{type: Number, required:true}
    },
    damage_team: {
      level: {type: Number, required:true},
      activity:{type: Number, required:true}
    },
    critical_shot: {
      level: {type: Number, required:true},
      activity:{type: Number, required:true}
    },
    masters_boarding: {
      level: {type: Number, required:true},
      activity:{type: Number, required:true}
    },
    musket_volley: {
      level: {type: Number, required:true},
      activity:{type: Number, required:true}
    },
    protection_ship: {
      level: {type: Number, required:true},
      activity:{type: Number, required:true}
    },
    quick_fix: {
      level: {type: Number, required:true},
      activity:{type: Number, required:true}
    },
    improved_treatment: {
      level: {type: Number, required:true},
      activity:{type: Number, required:true}
    },
    speed_ship: {
      level: {type: Number, required:true},
      activity:{type: Number, required:true}
    },
    maneuverability_ship: {
      level: {type: Number, required:true},
      activity:{type: Number, required:true}
    },
    learnbility: {
      level: {type: Number, required:true},
      activity:{type: Number, required:true}
    }
  },
  potions: {
    drug_intelligence: {
      number: {type: Number, required:true},
      created: {type: Date, required:true}
    },
    invigorating_rum: {
      number: {type: Number, required:true},
      created: {type: Date, required:true}
    },
    bottle_repairman: {
      number: {type: Number, required:true},
      created: {type: Date, required:true}
    },
    beverage_accuracy: {
      number: {type: Number, required:true},
      created: {type: Date, required:true}
    }
  },
  rating: {
    rating: {type: Number, required:true},
    number_rating: {type: Number, required:true},
    created: {type: Date, required:true}
  },
  point_rating: {type: Number, required:true},
  statistics: {
    victories: {type: Number, required:true},
    defeats: {type: Number, required:true},
    robbed: {type: Number, required:true},
    looted_caravans: {type: Number, required:true},
    lost: {type: Number, required:true}
  },
  war: {
    waiting: {type: Number, required:true},
    activity_war: {type: Number, required:true},
    user_war: {type: String },
    enemy_value: {type: Number },
    last_action: {type: Date, required:true},
    last_abilities_activity: {type: Date, required:true},
    last_recharge: {type: Date, required:true},
    reward: {type: Number }
  },
  bank: {
    credit: {
      number_credit: {type: Number, required:true}
    },
    storage: {
      slot1: {
        number_pesos: {type: Number, required:true},
        activity: {type: Number, required:true},
      },
      slot2: {
        number_pesos: {type: Number, required:true},
        activity: {type: Number, required:true},
      },
      slot3: {
        number_pesos: {type: Number, required:true},
        activity: {type: Number, required:true},
      }
    }
  },
  boti: {
    username: { type: String },
    avatar_index: {type: String },
    ship: {
      index_ship: {type: Number},
      hull: {type: Number},
      sails: {type: Number},
      guns: {
        number_guns: {type: Number},
        funt_guns: {type: Number},
        charge: {type: Number}
      },
      speed: {type: Number},
      mobility: {type: Number},
      hold: {type: Number},
      team: {
        sailors: {type: Number},
        boarders: {type: Number},
        gunners: {type: Number}
      },
      supplies: {
        core: {type: Number},
        buckshot: {type: Number},
        barshots: {type: Number},
        bombs: {type: Number},
        gunpowder: {type: Number},
        weapons: {type: Number},
        drugs: {type: Number}
      }
    },
    war: {
      waiting: {type: Number},
      activity_war: {type: Number},
      last_action: {type: Date},
      last_recharge: {type: Date}
    },
    skills: {
      marksmanship: {type: Number},
      boarding: {type: Number},
      resistance: {type: Number},
      protection: {type: Number},
      navigation: {type: Number}
    },
    abilities: {
      slot1: {
        name: {type: String},
        level: {type: Number}
      },
      slot2: {
        name: {type: String},
        level: {type: Number}
      },
      slot3: {
        name: {type: String},
        level: {type: Number}
      }
    }
  }

});

schema.methods.encryptPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._plainPassword;
  });

schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
  };

schema.statics.find_users = function (user_id, callback) {
  var User = this;
    async.waterfall([
      function (callback) {
        if(!user_id) callback;
        User.findById(user_id, callback);
      },
      function (user, callback) {
        if (user) {

            callback(null, user);
        } else {
            callback(new AuthError("Ошибка! Пожалуйста обратитесь в службу поддержки"));
        }
      }
    ], callback);
  }
  schema.statics.rename_password = function (user_id, password, new_par, povtor_new_par, callback) {
      var User = this;

      async.waterfall([
        function (callback) {
          if(!user_id) callback;
          User.findById(user_id, callback);
        },
        function (user, callback) {
          if (user) {
            if (user.checkPassword(password)) {
              if (new_par == povtor_new_par) {
                if (new_par.length >= 4) {
                  if(new_par.length <= 16) {
                    user.password = new_par;
                    user.save(function (err) {
                      if(err) return callback(err);
                      callback(null, user, null);
                    });
                  }else {
                      callback(null, user, "Пароль слишком длинный!");
                  }
                }else {
                    callback(null, user, "Пароль слишком короткий!");
                }
              } else {
                  callback(null, user, "Новый пароль повторно введен неверно!");
              }
            } else {
                callback(null, user, "Данные введены неверно!");
            }
          } else {
              callback(new AuthError("Действие невозможно!"));
          }
        }
      ], callback);
    };
schema.statics.authorize = function (username, password, callback) {
    var User = this;

    async.waterfall([
      function (callback) {
        User.findOne({username: username}, callback);
      },
      function (user, callback) {
        if (user) {
          if (user.checkPassword(password)) {
            callback(null, user);
          } else {
              callback(new AuthError("Логин или пароль введен неверено"));
          }
        } else {
            callback(new AuthError("Логин или пароль введен неверено"));
        }
      }
    ], callback);
  };

schema.statics.registration = function (username, password, callback) {
    var User = this;

    async.waterfall([
      function (callback) {
        User.findOne({username: username}, callback);
      },
      function (user, callback) {
        if (user) {
            callback(new AuthError("Данный логин уже существует"));
        } else {
            var date_now = new Date;
            var user = new User({
              username: username,
              password: password,
              created: date_now,
              gold_bars: 15,
              pesos:250,
              training: 1,
              promo: {
                end_promo: new Date(2018, 9, 22),
                close_promo: new Date(date_now.getTime()-1000*60*60*24)
              },
              assignments: {
                shop: {
                  name_port: 'в порт Ямайки',
                  index_cargo: 2,
                  cargo: 43,
                  activity: 0
                },
                tavern: {
                  name_port: 'на Тортугу',
                  reward: 316,
                  activity: 0
                },
                residence: {
                  name_pirates: 'Эдвард Тич',
                  reward: 4,
                  activity: 0
                },
                index_ship: 0,
                created: new Date(date_now.getFullYear(), date_now.getMonth(), date_now.getDate())
              },
              last_action: date_now,
              online: 1,
              online_day: 1,
              avatar_index: '6',
              ship: {
                index_ship: 0,
                hull: 250,
                sails: 140,
                guns: {
                  number_guns: 8,
                  funt_guns: 0,
                  charge: 0
                },
                created: date_now,
                plavanie: 0,
                speed: 14.53,
                mobility: 75.34,
                hold: 56.8,
                team: {
                  sailors: 4,
                  boarders: 5,
                  gunners: 5,
                  created: new Date
                },
                supplies: {
                  core: 50,
                  buckshot: 30,
                  barshots: 20,
                  bombs: 30,
                  gunpowder: 100,
                  food: 40,
                  weapons: 14,
                  drugs: 0
                }
              },
              skills: {
                marksmanship: 1,
                protection: 1,
                resistance: 1,
                boarding: 1,
                navigation: 1,
                number_marksmanship: 0,
                number_boarding: 0,
                number_resistance: 0,
                number_protection: 0,
                number_navigation: 0
              },
              abilities: {
                fast_recharge: {
                  level: 0,
                  activity: 0
                },
                damage_hull: {
                  level: 0,
                  activity: 0
                },
                damage_sails: {
                  level: 0,
                  activity: 0
                },
                damage_team: {
                  level: 0,
                  activity: 0
                },
                critical_shot: {
                  level: 0,
                  activity: 0
                },
                masters_boarding: {
                  level: 0,
                  activity: 0
                },
                musket_volley: {
                  level: 0,
                  activity: 0
                },
                protection_ship: {
                  level: 0,
                  activity: 0
                },
                quick_fix: {
                  level: 0,
                  activity: 0
                },
                improved_treatment: {
                  level: 0,
                  activity: 0
                },
                speed_ship: {
                  level: 0,
                  activity: 0
                },
                maneuverability_ship: {
                  level: 0,
                  activity: 0
                },
                learnbility: {
                  level: 0,
                  activity: 0
                }
              },
              potions: {
                drug_intelligence: {
                  number: 1,
                  created: new Date
                },
                invigorating_rum: {
                  number: 1,
                  created: new Date
                },
                bottle_repairman: {
                  number: 1,
                  created: new Date
                },
                beverage_accuracy: {
                  number: 1,
                  created: new Date
                }
              },
              rating: {
                rating: 0,
                number_rating: 0,
                created: new Date(date_now.getFullYear(), date_now.getMonth(), date_now.getDate())
              },
              point_rating: 0,
              statistics: {
                victories: 0,
                defeats: 0,
                robbed: 0,
                looted_caravans: 0,
                lost: 0
              },
              war: {
                waiting: 0,
                activity_war: 0,
                user_war: '0',
                last_abilities_activity: date_now,
                last_recharge: date_now,
                last_action: date_now
              },
              bank: {
                credit: {
                  number_credit: 0
                },
                storage: {
                  slot1: {
                    number_pesos: 0,
                    activity: 0,
                  },
                  slot2: {
                    number_pesos: 0,
                    activity: 0,
                  },
                  slot3: {
                    number_pesos: 0,
                    activity: 0,
                  }
                }
              }

            });

            user.save(function (err) {
              if(err) return callback(err);
              callback(null, user);
            });
        }
      }
    ], callback);
  };

exports.User = mongoose.model('User', schema);

function AuthError( message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);


  this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;
