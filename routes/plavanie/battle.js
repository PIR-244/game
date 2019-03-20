var User = require('../../models/user').User;
var HttpError = require('../../error').HttpError;
var AuthError = require('../../models/user').AuthError;
var async = require('async');
var ship = require('../../middleware/game/ship').list_ships;
var AuthError_journal = require('../../models/journal').AuthError_journal;
var Journal = require('../../models/journal').Journal;
var AuthError_journal = require('../../models/journal').AuthError_logWar;
var LogWar = require('../../models/logWar').LogWar;

exports.get = function (req, res,next) {
  async.waterfall([
      function(callback){
        if (req.user.war.activity_war >= 1 && req.user.war.activity_war <= 5 && req.user.war.user_war != 'bot') {
            User.findOne({username: req.user.war.user_war},function (err, enemy) {
              if (err) throw err;
              callback(null, enemy);
            });
        } else {
          callback(null, null);
        }
    },
      function(enemy, callback){
        //    Journal
        if (req.user.war.activity_war == 6) {
          Journal.find({ sender: { $in: [req.user.username, req.user.war.user_war]}, recipient: { $in: [ req.user.username, req.user.war.user_war ]}, rating: { $ne: -1 }}, function (err, journals) {
            if (err) {
              if (err instanceof AuthError_journal) {
                return next(new HttpError(403, err.message));
              } else {
                  return next(err);
              }
              }
              if (journals[0]) {
                var info_war = null;
                for (var i = 0; i < journals.length; i++) {
                  var date_now = new Date;
                      if (date_now.getTime()/1000 < journals[i].created.getTime()/1000+120 && journals[i].value_war <= 3) {
                          info_war = journals[i];
                      }
                  }
                  callback(null, enemy, info_war);
                } else {
                  callback(null, enemy, null);
                }
            });
        } else {
          callback(null, enemy, null);
        }
    },
      function (enemy, info_war, callback) {
        if (req.user.war.activity_war >= 3) {
          //    LogWar
          LogWar.find_logs(req.user.username, req.user.war.user_war, function (err, logWars) {
            if (err) {
              if (err instanceof AuthError_journal) {
                return next(new HttpError(403, err.message));
              } else {
                  return next(err);
              }
              }
            if (!logWars[0]) {
              logWars[0] = 0;
            }

              var position = 0;
              var logWars_poryadok = [];
              for (var i = 0; i < logWars.length; i++) {
                for (var j = 0; j < logWars_poryadok.length; j++) {
                    if (logWars_poryadok[j].created < logWars[i].created) {
                      position = j;
                      break;
                    }
                }

                  logWars_poryadok.splice(position, 0, logWars[i]);
                  position=logWars_poryadok.length;
              }

          callback(null, enemy, info_war, logWars_poryadok);

            });
        } else {
          callback(null, enemy, info_war, null);
        }
      }
  ], function (err, enemy, info_war, logWars) {
    res.locals.logWars = null;
    if (logWars) {
      res.locals.logWars = logWars;
    }
    var err_message_low = '';
    res.locals.enemy_name = null;
    res.locals.enemy_avatar = null;
    res.locals.hull_enemy = null;
    res.locals.sails_enemy = null;
    res.locals.team_enemy = null;
    res.locals.speed_enemy = null;
    res.locals.mobility_enemy = null;
    var url = 'poisk';
    if (req.user.war.activity_war >= 1 && req.user.war.activity_war <= 5) {
      var names_images = [];
      var alt_images = [];
      var abilities = require('../../middleware/game/abilities').abilities;
      if (req.user.abilities.damage_hull.activity > 0) {
        names_images.push('Korpus');
        alt_images.push(abilities.damage_hull.name);
      }
      if (req.user.abilities.damage_sails.activity > 0) {
        names_images.push('parus');
        alt_images.push(abilities.damage_sails.name);
      }
      if (req.user.abilities.damage_team.activity > 0) {
        names_images.push('komanda');
        alt_images.push(abilities.damage_team.name);
      }
      if (req.user.abilities.critical_shot.activity > 0) {
        names_images.push('krit');
        alt_images.push(abilities.critical_shot.name);
      }
      if (req.user.abilities.masters_boarding.activity > 0) {
        names_images.push('abordazh');
        alt_images.push(abilities.masters_boarding.name);
      }
      if (req.user.abilities.musket_volley.activity > 0) {
        names_images.push('zalp');
        alt_images.push(abilities.musket_volley.name);
      }
      if (req.user.abilities.protection_ship.activity > 0) {
        names_images.push('zaschita');
        alt_images.push(abilities.protection_ship.name);
      }
      if (req.user.abilities.quick_fix.activity > 0) {
        names_images.push('pochinka');
        alt_images.push(abilities.quick_fix.name);
      }
      if (req.user.abilities.improved_treatment.activity > 0) {
        names_images.push('lechenie');
        alt_images.push(abilities.improved_treatment.name);
      }
      if (req.user.abilities.speed_ship.activity > 0) {
        names_images.push('skorost');
        alt_images.push(abilities.speed_ship.name);
      }
      if (req.user.abilities.learnbility.activity > 0) {
        names_images.push('opyt');
        alt_images.push(abilities.learnbility.name);
      }
      if (req.user.abilities.maneuverability_ship.activity > 0) {
        names_images.push('manevrennost');
        alt_images.push(abilities.maneuverability_ship.name);
      }
      if (req.user.abilities.fast_recharge.activity > 0) {
        names_images.push('perezaryadka');
        alt_images.push(abilities.fast_recharge.name);
      }
      res.locals.names_images = names_images;
      res.locals.alt_images = alt_images;

      if (req.user.war.user_war == 'bot') {
        res.locals.enemy_name = req.user.boti.username;
        res.locals.enemy_avatar = req.user.boti.avatar_index;
        res.locals.hull_enemy = req.user.boti.ship.hull;
        res.locals.sails_enemy = req.user.boti.ship.sails;
        res.locals.team_enemy = req.user.boti.ship.team.sailors +
               req.user.boti.ship.team.boarders + req.user.boti.ship.team.gunners;
        res.locals.speed_enemy = req.user.boti.ship.speed;
        res.locals.mobility_enemy = req.user.boti.ship.mobility;
      } else {
          if (enemy) {
            res.locals.enemy_name = enemy.username;
            res.locals.enemy_avatar = enemy.avatar_index;
            res.locals.ship_enemy = ship[enemy.ship.index_ship].name;
            res.locals.hull_enemy = enemy.ship.hull;
            res.locals.sails_enemy = enemy.ship.sails;
            res.locals.team_enemy = enemy.ship.team.sailors +
                   enemy.ship.team.boarders + enemy.ship.team.gunners;
            res.locals.speed_enemy = enemy.ship.speed;
            res.locals.mobility_enemy = enemy.ship.mobility;
          }
      }
      if (req.user.war.activity_war == 1) {
        url = 'waiting_confirmation';
      } else if (req.user.war.activity_war == 2) {
        url = 'waiting_battle';
      } else if (req.user.war.activity_war == 3) {
        var sek_time_recharge = 0;
        var chance_explosion = 0;
        var time_recharge = require('../../middleware/game/time_recharge');
        time_recharge.Time_recharge(req, res, sek_time_recharge, chance_explosion, req.user);
        url = 'battle';
      } else if (req.user.war.activity_war == 4) {
        url = 'board';
      } else if (req.user.war.activity_war == 5) {
        url = 'departure';
      }
    } else if (req.user.war.activity_war == 6) {
      res.locals.info_war = null;
      if (info_war) {
        res.locals.info_war = info_war;
      }
      url = 'return_home';
    } else if (req.user.ship.plavanie != 1) {
      url = 'plavanie';
    }

    res.render('./plavanie/'+url, {err_message_low:err_message_low});
  });

};

exports.post = function (req, res,next) {
  var err_message_low = '';
  var user_id = req.session.user;

  User.find_users(user_id, function (err, user) {
    if (err) {
      if (err instanceof AuthError) {
        return next(new HttpError(403, err.message));
      } else {
          return next(err);
      }
      }
      async.waterfall([
        function (callback) {
          if (user.ship.plavanie == 0) {
            var matros_team = user.ship.team.sailors*3 + user.ship.team.boarders + user.ship.team.gunners;
            if (ship[user.ship.index_ship].hull*0.3 <= user.ship.hull &&
                ship[user.ship.index_ship].sails*0.3 <= user.ship.sails &&
                ship[user.ship.index_ship].team*0.1*3 <= matros_team) {
              user.ship.plavanie = 1;
              user.war.activity_war = 0;
              user.war.waiting = Math.floor(Math.random() * 22 + 33);
              user.war.last_action = new Date;
              var enemy_value = req.body.enemy;
              if (enemy_value == 'junior') {
                if (user.ship.index_ship != 0) {
                  user.war.enemy_value = 0;
                } else {
                  user.war.enemy_value = 1;
                }
              } else if (enemy_value == 'equal') {
                user.war.enemy_value = 1;

                // TRAINING
                if (user.training == 7) {
                  user.training++;
                }

              } else {
                if (user.ship.index_ship != 12) {
                  user.war.enemy_value = 2;
                } else {
                  user.war.enemy_value = 1;
                }
              }
              res.locals.plavanie_message = 1;
              user.save(function (err) {
                if(err) return next(err);
            });
            } else {
              if (ship[user.ship.index_ship].hull*0.3 <= user.ship.hull) {
                err_message_low = 'Корпус корабля не готов к плаванию. Требуемое значение: ' + Math.ceil(ship[user.ship.index_ship].hull*0.3);
              } else if (ship[user.ship.index_ship].sails*0.3 <= user.ship.sails) {
                err_message_low = 'Паруса не готовы к плаванию. Требуемое значение: ' + Math.ceil(ship[user.ship.index_ship].sails*0.3);
              } else {
                err_message_low = 'Недостаточно команды для плавания. Требуется матросов: ' + Math.ceil(ship[user.ship.index_ship].team*0.1*3);
              }
            }
            callback(null, err_message_low, user, null, null, null);
          }
          else if (user.ship.plavanie == 1) {
            if (user.war.activity_war == 0) {
              var away_value = req.body.away;
              if (away_value == 0) {
                var date_now = new Date;
                user.war.waiting = Math.ceil(date_now.getTime()/1000 - user.war.last_action.getTime()/1000);
                user.war.activity_war = 6;
                user.war.last_action = new Date;
                res.locals.plavanie_message = 5;
                user.save(function (err) {
                  if (err) throw err;
                });
              }
              callback(null, err_message_low, user, null, null, null);
            }
            else if (user.war.activity_war == 1) {
              var enemy_confirmation = req.body.confirmation;
              if (enemy_confirmation == 1) {
                if (user.war.user_war == 'bot') {
                  user.war.activity_war = 2;
                  user.war.waiting = 10;
                  user.war.last_action = new Date;
                  res.locals.plavanie_message = 3;

                  // TRAINING
                  if (user.training == 8) {
                    user.training++;
                  }

                  user.save(function (err) {
                    if(err) return next(err);
                });
                callback(null, err_message_low, user, null, null, null);
                } else {
                  User.findOne({username: user.war.user_war},function (err, enemy) {
                    if (err) throw err;
                    if (!enemy) {
                    //    Journal
                    Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
                        if (journal) {
                          journal.remove(function (err) {
                            if(err) throw err;
                          });
                        }
                      });
                      //    LogWar
                      LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                          if (logWars[0]) {
                            for (var i = 0; i < logWars.length; i++) {
                              logWars[i].remove(function (err) {
                                if(err) throw err;
                              });
                            }
                          }
                        });
                      user.war.activity_war = 0;
                      user.ship.plavanie = 0;
                      user.war.user_war = 0;
                      res.locals.plavanie_message = null;
                    } else {
                      if (enemy.ship.plavanie == 1 && enemy.war.activity_war >= 0 && enemy.war.activity_war <= 1 ||
                        enemy.ship.plavanie == 1 && enemy.war.activity_war == 6 || enemy.ship.plavanie == 2) {
                        if (enemy.ship.hull > 1) {
                          user.war.activity_war = 2;
                          user.war.waiting = 10;
                          user.war.last_action = new Date;
                          res.locals.plavanie_message = 3;

                          enemy.war.activity_war = 2;
                          enemy.war.waiting = 10;
                          enemy.war.last_action = new Date;
                          enemy.war.user_war = user.username;
                          var index_ship = 2;
                          if (user.war.enemy_value == 1) {
                            index_ship = 1;
                          } else if (user.war.enemy_value == 2) {
                            index_ship = 0;
                          }
                          enemy.war.enemy_value = index_ship;
                        } else {
                          err_message_low = 'Ты опоздал! Враг уже зашел в порт.';
                          user.war.activity_war = 0;
                          user.war.last_action = new Date;
                          user.war.waiting = Math.floor(Math.random() * 22 + 33);
                          res.locals.plavanie_message = 1;
                          //    Journal
                          Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
                              if (journal) {
                                journal.remove(function (err) {
                                  if(err) throw err;
                                });
                              }
                            });
                        }
                      } else {
                        err_message_low = 'Противник уже находится в бою';
                        user.war.activity_war = 0;
                        user.war.last_action = new Date;
                        user.war.waiting = Math.floor(Math.random() * 22 + 33);
                        res.locals.plavanie_message = 1;
                        //    Journal
                        Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
                            if (journal) {
                              journal.remove(function (err) {
                                if(err) throw err;
                              });
                            }
                          });
                      }
                    }
                    enemy.save(function (err) {
                      if (err) throw err;
                    });
                    user.save(function (err) {
                      if (err) throw err;
                    });
                    callback(null, err_message_low, user, null, null, null);
                  });
                }
              } else if (enemy_confirmation == 2) {// return home
                user.war.waiting = Math.floor(Math.random() * 15 + 23);
                user.war.activity_war = 6;
                user.war.last_action = new Date;
                res.locals.plavanie_message = 5;
                user.save(function (err) {
                  if (err) throw err;
                });
                //    Journal
                Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
                    if (journal) {
                      journal.remove(function (err) {
                        if(err) throw err;
                      });
                    }
                  });
                callback(null, err_message_low, user, null, null);
              } else { // next
                user.war.activity_war = 0;
                user.war.waiting = Math.floor(Math.random() * 22 + 33);
                user.war.last_action = new Date;
                res.locals.plavanie_message = 1;
                user.save(function (err) {
                  if (err) throw err;
                });
                //    Journal
                Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
                    if (journal) {
                      journal.remove(function (err) {
                        if(err) throw err;
                      });
                    }
                  });
                callback(null, err_message_low, user, null, null, null);
              }
            }
            // WAITING FOR start BATTLE
            else if (user.war.activity_war == 2) {
              err_message_low = 'Действие невозможно!';
              callback(null, err_message_low, user, null, null, null);
            }
            //    BATTLE
            else if (user.war.activity_war == 3) {
              var battle_value = req.body.battle;
              if (battle_value == 0) { // Залп
                if (user.ship.guns.number_guns > 0) {
                  var charge = 'core';
                  if (user.ship.guns.charge == 1) {
                    charge = 'buckshot';
                  } else if (user.ship.guns.charge == 2) {
                    charge = 'barshots';
                  } else if (user.ship.guns.charge == 3) {
                    charge = 'bombs';
                  }
                  if (user.ship.supplies[charge] > 0) {
                    if (user.ship.supplies.gunpowder > 0) {
                      var date_now = new Date;
                      var sek_time_recharge = 0;
                      var chance_explosion = 0;
                      var time_recharge = require('../../middleware/game/time_recharge');
                      time_recharge.Time_recharge(req, res, sek_time_recharge, chance_explosion, user);
                      sek_time_recharge = req.time_recharge;
                      chance_explosion = req.chance_explosion;
                      if (user.war.last_recharge.getTime()/1000 + sek_time_recharge <= date_now.getTime()/1000) {
                        var guns_number = user.ship.guns.number_guns;
                        if (user.ship.supplies[charge] < guns_number) {
                          guns_number = user.ship.supplies[charge];
                        }
                        if (user.ship.supplies.gunpowder < guns_number) {
                          guns_number = user.ship.supplies.gunpowder;
                        }
                        user.ship.supplies.gunpowder = user.ship.supplies.gunpowder - guns_number;
                        if (user.ship.supplies.gunpowder == 0) {
                          err_message_low = 'Порох закончился, Капитан!';
                        }
                        user.ship.supplies[charge] = user.ship.supplies[charge] - guns_number;
                        if (user.ship.supplies[charge] == 0) {
                          var mess_charge = 'Ядра закончились';
                          if (user.ship.guns.charge == 1) {
                            mess_charge = 'Картечь закончилась';
                          } else if (user.ship.guns.charge == 2) {
                            mess_charge = 'Книппели закончились';
                          } else if (user.ship.guns.charge == 3) {
                            mess_charge = 'Бомбы закончились';
                          }
                          err_message_low = mess_charge;
                        }
                        var guns_delete = 0;
                        for (var i = 0; i < guns_number; i++) {
                          var chance = Math.random() * 100;
                          if (chance_explosion >= chance) {
                            guns_delete++;
                          }
                        }
                        user.ship.guns.number_guns = user.ship.guns.number_guns - guns_delete;
                        user.war.last_recharge = new Date();
                        user.war.last_action = new Date;
                        var experience = require('../../middleware/game/experience').experience;
			                  var abilities = require('../../middleware/game/abilities').abilities;
                        var abilities_learn = 0;
                        if (user.abilities.learnbility.activity == 1 && user.abilities.learnbility.level > 0) {
                          abilities_learn = abilities.learnbility.levels_proc[user.abilities.learnbility.level]/100;
                        }
                        user.skills.number_marksmanship = user.skills.number_marksmanship +
                                        Math.floor((1+abilities_learn) * experience[user.ship.index_ship].protection);
                        if (user.skills.number_marksmanship >= Math.floor(Math.pow(user.skills.marksmanship+1, 2.66))) {
                          user.skills.number_marksmanship = user.skills.number_marksmanship -
                                                       Math.floor(Math.pow(user.skills.marksmanship+1, 2.66));
                          user.skills.marksmanship = user.skills.marksmanship + 1;
                        }
                        var ship_update = require('../../middleware/game/ship_update');
                        ship_update.Ship_update(user);
                        var guns = require('../../middleware/game/guns').list_guns;
                        if (user.war.user_war == 'bot') {
                          var accuracy = (guns[user.ship.guns.funt_guns].accuracy/(guns[user.ship.guns.funt_guns].accuracy+(user.boti.ship.mobility/user.ship.mobility)))*100;
                          var guns_hit = 0;
                          for (var i = 0; i < guns_number; i++) {
                            var chance = Math.random() * 100;
                            if (accuracy >= chance) {
                              guns_hit++;
                            }
                          }
                          var damage_hull = 3;
                          var damage_sails = 3;
                          var damage_team = 3;
                          if (user.ship.guns.charge == 1) {
                            damage_hull = 1;
                            damage_sails = 1;
                            damage_team = 10;
                          } else if (user.ship.guns.charge == 2) {
                            damage_hull = 1;
                            damage_sails = 10;
                            damage_team = 1;
                          } else if (user.ship.guns.charge == 3) {
                            damage_hull = 10;
                            damage_sails = 2;
                            damage_team = 2;
                          }
                          var guns_krit = 0;
                          var krit_chance = 5;
                          if (user.abilities.critical_shot.activity == 1 && user.abilities.critical_shot.level > 0) {
                            krit_chance = krit_chance +
                                abilities.critical_shot.levels_proc[user.abilities.critical_shot.level];
                          }
                          for (var i = 0; i < guns_hit; i++) {
                            var chance = Math.random() * 100;

                            if (krit_chance >= chance) {
                              guns_krit++;
                            }
                          }
                          var krit_logWar = 0;
                          if (guns_krit > 0) {
                            krit_logWar = 1;
                          }
                          guns_hit = guns_hit - guns_krit;
                          //   Расчет УРОНА
                          damage_hull = (damage_hull * guns_hit + damage_hull*guns_krit*10)*
                                        guns[user.ship.guns.funt_guns].damage;
                          damage_sails = (damage_sails * guns_hit + damage_sails*guns_krit*10)*
                                        guns[user.ship.guns.funt_guns].damage;
                          damage_team = (damage_team * guns_hit + damage_team*guns_krit*10)*
                                        guns[user.ship.guns.funt_guns].damage;
                          //  + skills *potion
                          var date_now = new Date;
                          var value_potion = 0;
                          if (date_now <= user.potions.beverage_accuracy.created) {
                            value_potion = 0.5;
                          }
                          var skills = (1+value_potion)*user.skills.marksmanship;
                          damage_hull = damage_hull + damage_hull*skills/100;
                          damage_sails = damage_sails + damage_sails*skills/100;
                          damage_team = damage_team + damage_team*skills/100;
                          // + abilities
                          if (user.abilities.damage_hull.activity == 1 && user.abilities.damage_hull.level > 0) {
                            damage_hull = damage_hull + damage_hull*
                                abilities.damage_hull.levels_proc[user.abilities.damage_hull.level]/100;
                          }
                          if (user.abilities.damage_sails.activity == 1 && user.abilities.damage_sails.level > 0) {
                            damage_sails = damage_sails + damage_sails*
                                abilities.damage_sails.levels_proc[user.abilities.damage_sails.level]/100;
                          }
                          if (user.abilities.damage_team.activity == 1 && user.abilities.damage_team.level > 0) {
                            damage_team = damage_team + damage_team*
                                abilities.damage_team.levels_proc[user.abilities.damage_team.level]/100;
                          }
                          // + protection and resistance ENEMY
                          damage_hull = damage_hull / (1 + user.boti.skills.protection*0.6/100);
                          damage_sails = damage_sails / (1 + user.boti.skills.protection*0.6/100);
                          damage_team = damage_team / (1 + user.boti.skills.resistance/100);
                          /*// + abilities enemy
                          if (user.boti.abilities.protection_ship.activity == 1 && user.boti.abilities.protection_ship.level > 0) {
                            damage_hull = Math.round(damage_hull * (1 -
                                abilities.protection_ship.levels_proc[user.boti.abilities.protection_ship.level]/100));
                          }*/

                          if (Math.round(damage_hull) >= user.boti.ship.hull-1) {
                            // residence_true
                            if (user.assignments.residence.activity == 1 && user.boti.username == user.assignments.residence.name_pirates) {
                              user.assignments.residence.activity = 2;
                              user.gold_bars = user.gold_bars + user.assignments.residence.reward;
                              user.rating.number_rating = user.rating.number_rating + 2;
                              //    Journal
                                Journal.find_journals(user.username, function (err, journals) {
                                    if (!journals[0]) {
                                      journals[0] = 0;
                                    }
                                    var name_true = user.boti.username;
                                    if (journals.length < 100) {
                                      var journal = new Journal({
                                        sender: user.username,
                                        recipient: user.war.user_war,
                                        value_war: 4, // residence_true
                                        number_one: 0,
                                        reward: user.assignments.residence.reward,
                                        rating: 2,
                                        bot_name: name_true,
                                        created: new Date(date_now.getTime()+1000)
                                      });
                                      journal.save(function (err) {
                                        if(err) throw err;
                                      });
                                    } else {

                                      var position = 0;
                                      var journals_poryadok = [];
                                      var value_delete = 0;
                                      for (var i = 0; i < journals.length; i++) {
                                        for (var j = 0; j < journals_poryadok.length; j++) {
                                            if (journals_poryadok[j].created < journals[i].created) {
                                              position = j;
                                              break;
                                            }
                                            if (j+1 == journals_poryadok.length) {
                                              value_delete = i;
                                            }
                                        }
                                          journals_poryadok.splice(position, 0, journals[i]);
                                          position=journals_poryadok.length;
                                      }

                                      journals[value_delete].sender = user.username;
                                      journals[value_delete].recipient = user.war.user_war;
                                      journals[value_delete].value_war = 4, // residence_true
                                      journals[value_delete].number_one = 0,
                                      journals[value_delete].reward = user.assignments.residence.reward,
                                      journals[value_delete].rating = 2;
                                      journals[value_delete].bot_name = name_true;
                                      journals[value_delete].created = new Date(date_now.getTime()+1000);
                                      journals[value_delete].save(function (err) {
                                        if(err) throw err;
                                      });

                                    }
                                  });
                            }
                            var boti = require('../../middleware/game/boti').bots_standart;
                            user.boti.ship.team.sailors = 0;
                            user.boti.ship.team.boarders = 0;
                            user.boti.ship.team.gunners = 0;
                            user.war.reward = Math.floor(Math.random() * ((boti[user.boti.ship.index_ship].reward)*0.6)
                             + (boti[user.boti.ship.index_ship].reward*0.7));
                            user.statistics.victories = user.statistics.victories + 1;
                            user.statistics.robbed = user.statistics.robbed + user.war.reward;
                            var rating_win = 0;
                            if (user.war.enemy_value == 1) {
                              rating_win = 1;
                            } else if (user.war.enemy_value == 2) {
                              rating_win = 2;
                            }
                            user.rating.number_rating = user.rating.number_rating + rating_win;
                            user.pesos = user.pesos + user.war.reward;
                            user.war.waiting = Math.floor(Math.random() * 15 + 23);
                            user.war.activity_war = 6;
                            user.war.last_action = new Date;
                            res.locals.plavanie_message = 5;

                            // TRAINING
                            if (user.training == 9) {
                              user.training++;
                            }

                            user.save(function (err) {
                              if(err) return next(err);
                            });

                            //    Journal
                            Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
                              if (err) {
                                if (err instanceof AuthError_journal) {
                                  return next(new HttpError(403, err.message));
                                } else {
                                    return next(err);
                                }
                                }
                                if (journal) {
                                  rating_win = 0;
                                  if (user.war.enemy_value == 1) {
                                    rating_win = 1;
                                  } else if (user.war.enemy_value == 2) {
                                    rating_win = 2;
                                  }
                                  journal.rating = rating_win;
                                  journal.value_war = 0; // потопить
                                  if (journal.sender == user.username) {
                                    journal.number_one = 0;
                                  } else {
                                    journal.number_one = 1;
                                  }
                                  journal.reward = user.war.reward;
                                  journal.created = new Date;
                                  journal.save(function (err) {
                                    if(err) return next(err);
                                  });

                                  //    LogWar
                                  LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                                    if (err) {
                                      if (err instanceof AuthError_logWar) {
                                        return next(new HttpError(403, err.message));
                                      } else {
                                          return next(err);
                                      }
                                      }
                                    if (!logWars[0]) {
                                      logWars[0] = 0;
                                    }
                                    if (logWars.length < 5) {
                                      var logWar = new LogWar({
                                        sender: user.username,
                                        recipient: user.war.user_war,
                                        damage_one: Math.round(damage_hull) + Math.round(damage_sails) + Math.round(damage_team),
                                        damage_two: guns_delete,
                                        charge: user.ship.guns.charge,
                                        krit_true: krit_logWar,
                                        team_res: 0,
                                        value_war: 0, // zalp
                                        created: new Date
                                      });
                                      logWar.save(function (err) {
                                        if(err) throw err;
                                      });
                                      logWars[logWars.length] = logWar;
                                    } else {

                                      var position = 0;
                                      var logWars_poryadok = [];
                                      var value_delete = 0;
                                      for (var i = 0; i < logWars.length; i++) {
                                        for (var j = 0; j < logWars_poryadok.length; j++) {
                                            if (logWars_poryadok[j].created < logWars[i].created) {
                                              position = j;
                                              break;
                                            }
                                            if (j+1 == logWars_poryadok.length) {
                                              value_delete = i;
                                            }
                                        }
                                          logWars_poryadok.splice(position, 0, logWars[i]);
                                          position=logWars_poryadok.length;
                                      }

                                      logWars[value_delete].sender = user.username;
                                      logWars[value_delete].recipient = user.war.user_war;
                                      logWars[value_delete].damage_one = Math.round(damage_hull) + Math.round(damage_sails) + Math.round(damage_team),
                                      logWars[value_delete].damage_two = guns_delete,
                                      logWars[value_delete].charge = user.ship.guns.charge,
                                      logWars[value_delete].krit_true = krit_logWar,
                                      logWars[value_delete].team_res = 0,
                                      logWars[value_delete].value_war = 0; // zalp
                                      logWars[value_delete].created = new Date;
                                      logWars[value_delete].save(function (err) {
                                        if(err) throw err;
                                      });

                                    }
                                    var position = 0;
                                    var logWars_poryadok = [];
                                    for (var i = 0; i < logWars.length; i++) {
                                      for (var j = 0; j < logWars_poryadok.length; j++) {
                                          if (logWars_poryadok[j].created < logWars[i].created) {
                                            position = j;
                                            break;
                                          }
                                      }
                                        logWars_poryadok.splice(position, 0, logWars[i]);
                                        position=logWars_poryadok.length;
                                    }
                                    callback(null, err_message_low, user, journal, null, logWars_poryadok);
                                    });
                                } else {
                                  callback(null, err_message_low, user, null, null, null);
                                }
                              });
                          } else { // Не критично
                            /*if (user.boti.abilities.protection_ship.activity == 1 && user.boti.abilities.protection_ship.level > 0) {
                              damage_sails = Math.round(damage_sails * (1 -
                                  abilities.protection_ship.levels_proc[user.boti.abilities.protection_ship.level]/100));
                            }*/
                            rip_team = Math.round(damage_team / 10);
                            var team = user.boti.ship.team.sailors + user.boti.ship.team.boarders + user.boti.ship.team.gunners;
                            if (rip_team > team) {
                              rip_team = team;
                            }
                            var team_res = 0;
                            if (rip_team > 0 && user.boti.ship.supplies.drugs > 0) {
                              var treatment_battle = require('../../middleware/game/treatment_battle');
                              treatment_battle.Treatment_battle_bot(req, rip_team, user);
                              team_res = rip_team - req.rip_team;
                              rip_team = req.rip_team;
                            }
                            if (Math.round(damage_sails) > user.boti.ship.sails) {
                              damage_sails = user.boti.ship.sails;
                            }
                            user.boti.ship.hull = user.boti.ship.hull - Math.round(damage_hull);
                            user.boti.ship.sails = user.boti.ship.sails - Math.round(damage_sails);
                            var rip;
                            while (rip_team > 0 && team > 0) {
                              rip = Math.floor(Math.random() * 3 + 1);
                              if(rip == 1)  {
                                if(user.boti.ship.team.sailors != 0) {
                                  user.boti.ship.team.sailors = user.boti.ship.team.sailors - 1;
                                  rip_team--;
                                }
                              }
                              if(rip == 2)  {
                                if(user.boti.ship.team.boarders != 0){
                                  user.boti.ship.team.boarders = user.boti.ship.team.boarders - 1;
                                  rip_team--;
                                }
                              }
                              if(rip == 3)  {
                                if(user.boti.ship.team.gunners != 0) {
                                  user.boti.ship.team.gunners = user.boti.ship.team.gunners - 1;
                                  rip_team--;
                                }
                              }
                              team = user.boti.ship.team.sailors + user.boti.ship.team.boarders + user.boti.ship.team.gunners;
                            }
                            var boti_update = require('../../middleware/game/boti_update');
                            boti_update.Boti_update(user.boti);
                            user.save(function (err) {
                              if(err) return next(err);
                          });
                          //    LogWar
                          LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                            if (err) {
                              if (err instanceof AuthError_logWar) {
                                return next(new HttpError(403, err.message));
                              } else {
                                  return next(err);
                              }
                              }
                            if (!logWars[0]) {
                              logWars[0] = 0;
                            }
                            if (logWars.length < 5) {
                              var logWar = new LogWar({
                                sender: user.username,
                                recipient: user.war.user_war,
                                damage_one: Math.round(damage_hull) + Math.round(damage_sails) + Math.round(damage_team),
                                damage_two: guns_delete,
                                charge: user.ship.guns.charge,
                                krit_true: krit_logWar,
                                team_res: team_res,
                                value_war: 0, // zalp
                                created: new Date
                              });
                              logWar.save(function (err) {
                                if(err) throw err;
                              });
                              logWars[logWars.length] = logWar;
                            } else {

                              var position = 0;
                              var logWars_poryadok = [];
                              var value_delete = 0;
                              for (var i = 0; i < logWars.length; i++) {
                                for (var j = 0; j < logWars_poryadok.length; j++) {
                                    if (logWars_poryadok[j].created < logWars[i].created) {
                                      position = j;
                                      break;
                                    }
                                    if (j+1 == logWars_poryadok.length) {
                                      value_delete = i;
                                    }
                                }
                                  logWars_poryadok.splice(position, 0, logWars[i]);
                                  position=logWars_poryadok.length;
                              }

                              logWars[value_delete].sender = user.username;
                              logWars[value_delete].recipient = user.war.user_war;
                              logWars[value_delete].damage_one = Math.round(damage_hull) + Math.round(damage_sails) + Math.round(damage_team),
                              logWars[value_delete].damage_two = guns_delete,
                              logWars[value_delete].charge = user.ship.guns.charge,
                              logWars[value_delete].krit_true = krit_logWar,
                              logWars[value_delete].team_res = team_res,
                              logWars[value_delete].value_war = 0; // zalp
                              logWars[value_delete].created = new Date;
                              logWars[value_delete].save(function (err) {
                                if(err) throw err;
                              });

                            }
                            var position = 0;
                            var logWars_poryadok = [];
                            for (var i = 0; i < logWars.length; i++) {
                              for (var j = 0; j < logWars_poryadok.length; j++) {
                                  if (logWars_poryadok[j].created < logWars[i].created) {
                                    position = j;
                                    break;
                                  }
                              }
                                logWars_poryadok.splice(position, 0, logWars[i]);
                                position=logWars_poryadok.length;
                            }
                            callback(null, err_message_low, user, null, null, logWars_poryadok);
                            });
                          }
                        } else {
                          User.findOne({username: user.war.user_war},function (err, enemy) {
                            if (err) throw err;
                            if (!enemy) {
                            //    Journal
                            Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
                                if (journal) {
                                  journal.remove(function (err) {
                                    if(err) throw err;
                                  });
                                }
                              });
                              //    LogWar
                              LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                                  if (logWars[0]) {
                                    for (var i = 0; i < logWars.length; i++) {
                                      logWars[i].remove(function (err) {
                                        if(err) throw err;
                                      });
                                    }
                                  }
                                });
                              user.war.activity_war = 0;
                              user.ship.plavanie = 0;
                              user.war.user_war = 0;
                              res.locals.plavanie_message = 1;
                            } else {
                              var accuracy = (guns[user.ship.guns.funt_guns].accuracy/(guns[user.ship.guns.funt_guns].accuracy+(enemy.ship.mobility/user.ship.mobility)))*100;
                              var guns_hit = 0;
                              for (var i = 0; i < guns_number; i++) {
                                var chance = Math.random() * 100;
                                if (accuracy >= chance) {
                                  guns_hit++;
                                }
                              }
                              var damage_hull = 3;
                              var damage_sails = 3;
                              var damage_team = 3;
                              if (user.ship.guns.charge == 1) {
                                damage_hull = 1;
                                damage_sails = 1;
                                damage_team = 10;
                              } else if (user.ship.guns.charge == 2) {
                                damage_hull = 1;
                                damage_sails = 10;
                                damage_team = 1;
                              } else if (user.ship.guns.charge == 3) {
                                damage_hull = 10;
                                damage_sails = 2;
                                damage_team = 2;
                              }
                              var abilities_learn = 0;
                              if (enemy.abilities.learnbility.activity == 1 && enemy.abilities.learnbility.level > 0) {
                                abilities_learn = abilities.learnbility.levels_proc[enemy.abilities.learnbility.level]/100;
                              }
                              enemy.skills.number_protection = enemy.skills.number_protection + Math.floor((1+abilities_learn) *
                                       (damage_hull/10 + damage_sails/10)*experience[enemy.ship.index_ship].protection);
                              if (enemy.skills.number_protection >= Math.floor(Math.pow(enemy.skills.protection+1, 2.55))) {
                                enemy.skills.number_protection = enemy.skills.number_protection -
                                                             Math.floor(Math.pow(enemy.skills.protection+1, 2.55));
                                enemy.skills.protection = enemy.skills.protection + 1;
                              }
                              enemy.skills.number_resistance = enemy.skills.number_resistance + Math.floor((1+abilities_learn) *
                                      damage_team/10*experience[enemy.ship.index_ship].protection);
                              if (enemy.skills.number_resistance >= Math.floor(Math.pow(enemy.skills.resistance+1, 2.58))) {
                                enemy.skills.number_resistance = enemy.skills.number_resistance -
                                                             Math.floor(Math.pow(enemy.skills.resistance+1, 2.58));
                                enemy.skills.resistance = enemy.skills.resistance + 1;
                              }
                              var guns_krit = 0;
                              var krit_chance = 5;
                              if (user.abilities.critical_shot.activity == 1 && user.abilities.critical_shot.level > 0) {
                                krit_chance = krit_chance +
                                    abilities.critical_shot.levels_proc[user.abilities.critical_shot.level];
                              }
                              for (var i = 0; i < guns_hit; i++) {
                                var chance = Math.random() * 100;
                                if (krit_chance >= chance) {
                                  guns_krit++;
                                }
                              }
                              var krit_logWar = 0;
                              if (guns_krit > 0) {
                                krit_logWar = 1;
                              }
                              guns_hit = guns_hit - guns_krit;
                              //   Расчет УРОНА
                              damage_hull = (damage_hull * guns_hit + damage_hull*guns_krit*10)*
                                            guns[user.ship.guns.funt_guns].damage;
                              damage_sails = (damage_sails * guns_hit + damage_sails*guns_krit*10)*
                                            guns[user.ship.guns.funt_guns].damage;
                              damage_team = (damage_team * guns_hit + damage_team*guns_krit*10)*
                                            guns[user.ship.guns.funt_guns].damage;
                              //  + skills *potion
                              var date_now = new Date;
                              var value_potion = 0;
                              if (date_now <= user.potions.beverage_accuracy.created) {
                                value_potion = 0.5;
                              }
                              var skills = (1+value_potion)*user.skills.marksmanship;
                              damage_hull = damage_hull + damage_hull*skills/100;
                              damage_sails = damage_sails + damage_sails*skills/100;
                              damage_team = damage_team + damage_team*skills/100;
                              // + abilities
                              if (user.abilities.damage_hull.activity == 1 && user.abilities.damage_hull.level > 0) {
                                damage_hull = damage_hull + damage_hull*
                                    abilities.damage_hull.levels_proc[user.abilities.damage_hull.level]/100;
                              }
                              if (user.abilities.damage_sails.activity == 1 && user.abilities.damage_sails.level > 0) {
                                damage_sails = damage_sails + damage_sails*
                                    abilities.damage_sails.levels_proc[user.abilities.damage_sails.level]/100;
                              }
                              if (user.abilities.damage_team.activity == 1 && user.abilities.damage_team.level > 0) {
                                damage_team = damage_team + damage_team*
                                    abilities.damage_team.levels_proc[user.abilities.damage_team.level]/100;
                              }
                              // + protection and resistance ENEMY
                              damage_hull = damage_hull / (1 + enemy.skills.protection*0.6/100);
                              damage_sails = damage_sails / (1 + enemy.skills.protection*0.6/100);
                              damage_team = damage_team / (1 + enemy.skills.resistance/100);
                              // + abilities enemy
                              if (enemy.abilities.protection_ship.activity == 1 && enemy.abilities.protection_ship.level > 0) {
                                damage_hull = damage_hull * (1 -
                                    abilities.protection_ship.levels_proc[enemy.abilities.protection_ship.level]/100);
                                damage_sails = damage_sails * (1 -
                                    abilities.protection_ship.levels_proc[enemy.abilities.protection_ship.level]/100);
                              }
                              // Урон высчитывается
                              if (Math.round(damage_hull) >= enemy.ship.hull-1) {
                                enemy.ship.team.sailors = 0;
                                enemy.ship.team.boarders = 0;
                                enemy.ship.team.gunners = 0;
                                enemy.war.reward = -enemy.pesos;
                                enemy.statistics.defeats = enemy.statistics.defeats + 1;
                                enemy.statistics.lost = enemy.statistics.lost + enemy.pesos;
                                enemy.ship.hull = 1;
                                enemy.ship.sails = 0;
                                var rating_lose = 0;
                                if (enemy.war.enemy_value == 0) {
                                  rating_lose = 1;
                                }
                                if (enemy.rating.number_rating > 0) {
                                  enemy.rating.number_rating = enemy.rating.number_rating - rating_lose;
                                }

                                user.war.reward = enemy.pesos;
                                user.statistics.victories = user.statistics.victories + 1;
                                user.statistics.robbed = user.statistics.robbed + user.war.reward;
                                var rating_win = 0;
                                if (user.war.enemy_value == 1) {
                                  rating_win = 1;
                                } else if (user.war.enemy_value == 2) {
                                  rating_win = 2;
                                }
                                user.rating.number_rating = user.rating.number_rating + rating_win;
                                user.pesos = user.pesos + user.war.reward;
                                enemy.pesos = 0;
                                user.war.waiting = Math.floor(Math.random() * 15 + 23);
                                user.war.activity_war = 6;
                                user.war.last_action = new Date;
                                enemy.war.waiting = Math.floor(Math.random() * 15 + 23);
                                enemy.war.activity_war = 6;
                                enemy.war.last_action = new Date;
                                res.locals.plavanie_message = 5;
                                enemy.save(function (err) {
                                  if (err) throw err;
                                });
                                user.save(function (err) {
                                  if (err) throw err;
                                });

                                //    Journal
                                Journal.find_journal(user.username, enemy.username, function (err, journal) {
                                  if (err) {
                                    if (err instanceof AuthError_journal) {
                                      return next(new HttpError(403, err.message));
                                    } else {
                                        return next(err);
                                    }
                                    }
                                    if (journal) {
                                      journal.rating = rating_win;
                                      journal.value_war = 0; // потопить
                                      if (journal.sender == user.username) {
                                        journal.number_one = 0;
                                      } else {
                                        journal.number_one = 1;
                                      }
                                      journal.reward = user.war.reward;
                                      journal.created = new Date;
                                      journal.save(function (err) {
                                        if(err) return next(err);
                                      });

                                      //    LogWar
                                      LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                                        if (err) {
                                          if (err instanceof AuthError_logWar) {
                                            return next(new HttpError(403, err.message));
                                          } else {
                                              return next(err);
                                          }
                                          }
                                        if (!logWars[0]) {
                                          logWars[0] = 0;
                                        }
                                        if (logWars.length < 5) {
                                          var logWar = new LogWar({
                                            sender: user.username,
                                            recipient: user.war.user_war,
                                            damage_one: Math.round(damage_hull) + Math.round(damage_sails) + Math.round(damage_team),
                                            damage_two: guns_delete,
                                            charge: user.ship.guns.charge,
                                            krit_true: krit_logWar,
                                            team_res: 0,
                                            value_war: 0, // zalp
                                            created: new Date
                                          });
                                          logWar.save(function (err) {
                                            if(err) throw err;
                                          });
                                          logWars[logWars.length] = logWar;
                                        } else {

                                          var position = 0;
                                          var logWars_poryadok = [];
                                          var value_delete = 0;
                                          for (var i = 0; i < logWars.length; i++) {
                                            for (var j = 0; j < logWars_poryadok.length; j++) {
                                                if (logWars_poryadok[j].created < logWars[i].created) {
                                                  position = j;
                                                  break;
                                                }
                                                if (j+1 == logWars_poryadok.length) {
                                                  value_delete = i;
                                                }
                                            }
                                              logWars_poryadok.splice(position, 0, logWars[i]);
                                              position=logWars_poryadok.length;
                                          }

                                          logWars[value_delete].sender = user.username;
                                          logWars[value_delete].recipient = user.war.user_war;
                                          logWars[value_delete].damage_one = Math.round(damage_hull) + Math.round(damage_sails) + Math.round(damage_team),
                                          logWars[value_delete].damage_two = guns_delete,
                                          logWars[value_delete].charge = user.ship.guns.charge,
                                          logWars[value_delete].krit_true = krit_logWar,
                                          logWars[value_delete].team_res = 0,
                                          logWars[value_delete].value_war = 0; // zalp
                                          logWars[value_delete].created = new Date;
                                          logWars[value_delete].save(function (err) {
                                            if(err) throw err;
                                          });

                                        }
                                        var position = 0;
                                        var logWars_poryadok = [];
                                        for (var i = 0; i < logWars.length; i++) {
                                          for (var j = 0; j < logWars_poryadok.length; j++) {
                                              if (logWars_poryadok[j].created < logWars[i].created) {
                                                position = j;
                                                break;
                                              }
                                          }
                                            logWars_poryadok.splice(position, 0, logWars[i]);
                                            position=logWars_poryadok.length;
                                        }
                                      callback(null, err_message_low, user, journal, null, logWars_poryadok);
                                    });
                                    } else {
                                      callback(null, err_message_low, user, null, null, null);
                                    }
                                  });
                              } else { // Не критично

                                rip_team = Math.round(damage_team / 10);
                                var team = enemy.ship.team.sailors + enemy.ship.team.boarders + enemy.ship.team.gunners;
                                if (rip_team > team) {
                                  rip_team = team;
                                }
                                var team_res = 0;
                                if (rip_team > 0 && enemy.ship.supplies.drugs > 0) {
                                  var treatment_battle = require('../../middleware/game/treatment_battle');
                                  treatment_battle.Treatment_battle(req, rip_team, enemy);
                                  team_res = rip_team - req.rip_team;
                                  rip_team = req.rip_team;
                                }
                                if (Math.round(damage_sails) > enemy.ship.sails) {
                                  damage_sails = enemy.ship.sails;
                                }
                                enemy.ship.hull = enemy.ship.hull - Math.round(damage_hull);
                                enemy.ship.sails = enemy.ship.sails - Math.round(damage_sails);
                                var rip;
                                while (rip_team > 0 && team > 0) {
                                  rip = Math.floor(Math.random() * 3 + 1);
                                  if(rip == 1)  {
                                    if(enemy.ship.team.sailors != 0) {
                                      enemy.ship.team.sailors = enemy.ship.team.sailors - 1;
                                      rip_team--;
                                    }
                                  }
                                  if(rip == 2)  {
                                    if(enemy.ship.team.boarders != 0){
                                      enemy.ship.team.boarders = enemy.ship.team.boarders - 1;
                                      rip_team--;
                                    }
                                  }
                                  if(rip == 3)  {
                                    if(enemy.ship.team.gunners != 0) {
                                      enemy.ship.team.gunners = enemy.ship.team.gunners - 1;
                                      rip_team--;
                                    }
                                  }
                                  team = enemy.ship.team.sailors + enemy.ship.team.boarders + enemy.ship.team.gunners;
                                }

                                ship_update.Ship_update(enemy);
                                enemy.save(function (err) {
                                  if (err) throw err;
                                });
                                user.save(function (err) {
                                  if (err) throw err;
                                });

                                //    LogWar
                                LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                                  if (err) {
                                    if (err instanceof AuthError_logWar) {
                                      return next(new HttpError(403, err.message));
                                    } else {
                                        return next(err);
                                    }
                                    }
                                  if (!logWars[0]) {
                                    logWars[0] = 0;
                                  }
                                  if (logWars.length < 5) {
                                    var logWar = new LogWar({
                                      sender: user.username,
                                      recipient: user.war.user_war,
                                      damage_one: Math.round(damage_hull) + Math.round(damage_sails) + Math.round(damage_team),
                                      damage_two: guns_delete,
                                      charge: user.ship.guns.charge,
                                      krit_true: krit_logWar,
                                      team_res: team_res,
                                      value_war: 0, // zalp
                                      created: new Date
                                    });
                                    logWar.save(function (err) {
                                      if(err) throw err;
                                    });
                                    logWars[logWars.length] = logWar;
                                  } else {

                                    var position = 0;
                                    var logWars_poryadok = [];
                                    var value_delete = 0;
                                    for (var i = 0; i < logWars.length; i++) {
                                      for (var j = 0; j < logWars_poryadok.length; j++) {
                                          if (logWars_poryadok[j].created < logWars[i].created) {
                                            position = j;
                                            break;
                                          }
                                          if (j+1 == logWars_poryadok.length) {
                                            value_delete = i;
                                          }
                                      }
                                        logWars_poryadok.splice(position, 0, logWars[i]);
                                        position=logWars_poryadok.length;
                                    }

                                    logWars[value_delete].sender = user.username;
                                    logWars[value_delete].recipient = user.war.user_war;
                                    logWars[value_delete].damage_one = Math.round(damage_hull) + Math.round(damage_sails) + Math.round(damage_team),
                                    logWars[value_delete].damage_two = guns_delete,
                                    logWars[value_delete].charge = user.ship.guns.charge,
                                    logWars[value_delete].krit_true = krit_logWar,
                                    logWars[value_delete].team_res = team_res,
                                    logWars[value_delete].value_war = 0; // zalp
                                    logWars[value_delete].created = new Date;
                                    logWars[value_delete].save(function (err) {
                                      if(err) throw err;
                                    });

                                  }
                                  var position = 0;
                                  var logWars_poryadok = [];
                                  for (var i = 0; i < logWars.length; i++) {
                                    for (var j = 0; j < logWars_poryadok.length; j++) {
                                        if (logWars_poryadok[j].created < logWars[i].created) {
                                          position = j;
                                          break;
                                        }
                                    }
                                      logWars_poryadok.splice(position, 0, logWars[i]);
                                      position=logWars_poryadok.length;
                                  }
                                callback(null, err_message_low, user, null, enemy, logWars_poryadok);
                              });
                              }
                        }
                      });
                    }
                      } else {
                        err_message_low = 'Идет зарядка...';
                        callback(null, err_message_low, user, null, null, null);
                      }
                    } else {
                      err_message_low = 'Порох закончился, Капитан!';
                      callback(null, err_message_low, user, null, null, null);
                    }
                  } else {
                    var mess_charge = 'Ядра закончились';
                    if (user.ship.guns.charge == 1) {
                      mess_charge = 'Картечь закончилась';
                    } else if (user.ship.guns.charge == 2) {
                      mess_charge = 'Книппели закончились';
                    } else if (user.ship.guns.charge == 3) {
                      mess_charge = 'Бомбы закончились';
                    }
                    if (user.ship.guns.charge < 3 && user.ship.guns.charge >= 0) {
                      user.ship.guns.charge++;
                    } else {
                      user.ship.guns.charge=0;
                    }
                    user.war.last_recharge = new Date();
                    user.save(function (err) {
                      if(err) return next(err);
                    });
                    err_message_low = mess_charge;
                    callback(null, err_message_low, user, null, null, null);
                  }
                } else {
                  err_message_low = 'У вас нет орудий!';
                  callback(null, err_message_low, user, null, null, null);
                }
              } else if (battle_value == 1) { // Абордаж
                if (user.war.user_war == 'bot') {
                  if (user.ship.speed / user.boti.ship.speed >= 1.3) {
                    user.war.waiting = 30;
                    user.war.last_action = new Date;
                    user.war.activity_war = 4;
                    res.locals.plavanie_message = 4;
                    user.save(function (err) {
                      if(err) return next(err);
                    });
                    callback(null, err_message_low, user, null, null, null);
                  } else {
                    err_message_low = 'Недостаточно скорости! Требуемое значение: '+Math.floor(user.boti.ship.speed*1.3*100)/100;
                    callback(null, err_message_low, user, null, null, null);
                  }
                } else {
                  User.findOne({username: user.war.user_war},function (err, enemy) {
                    if (err) throw err;
                    if (!enemy) {
                    //    Journal
                    Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
                        if (journal) {
                          journal.remove(function (err) {
                            if(err) throw err;
                          });
                        }
                      });
                      //    LogWar
                      LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                          if (logWars[0]) {
                            for (var i = 0; i < logWars.length; i++) {
                              logWars[i].remove(function (err) {
                                if(err) throw err;
                              });
                            }
                          }
                        });
                      user.war.activity_war = 0;
                      user.ship.plavanie = 0;
                      user.war.user_war = 0;
                      res.locals.plavanie_message = 0;
                    } else {
                      if (user.ship.speed / enemy.ship.speed >= 1.3) {
                        user.war.waiting = 30;
                        user.war.last_action = new Date;
                        user.war.activity_war = 4;
                        res.locals.plavanie_message = 4;
                      } else {
                        err_message_low = 'Недостаточно скорости! Требуемое значение: '+Math.floor(enemy.ship.speed*1.3*100)/100;
                      }
                    }

                    user.save(function (err) {
                      if (err) throw err;
                    });
                    callback(null, err_message_low, user, null, null, null);
                  });
                }
              } else /*if (battle_value == 2)*/ { // Уплыть
                if (user.war.user_war == 'bot') {
                  if (user.ship.speed / user.boti.ship.speed >= 1.3) {
                    user.war.waiting = 30;
                    user.war.last_action = new Date;
                    user.war.activity_war = 5;
                    res.locals.plavanie_message = 4;
                    user.save(function (err) {
                      if (err) throw err;
                    });
                    callback(null, err_message_low, user, null, null, null);
                  } else {
                    err_message_low = 'Недостаточно скорости! Требуемое значение: '+Math.floor(user.boti.ship.speed*1.3*100)/100;
                    callback(null, err_message_low, user, null, null, null);
                  }
                } else {
                  User.findOne({username: user.war.user_war},function (err, enemy) {
                    if (err) throw err;
                    if (!enemy) {
                    //    Journal
                    Journal.find_journal(user.username, user.war.user_war, function (err, journal) {
                        if (journal) {
                          journal.remove(function (err) {
                            if(err) throw err;
                          });
                        }
                      });
                      //    LogWar
                      LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                          if (logWars[0]) {
                            for (var i = 0; i < logWars.length; i++) {
                              logWars[i].remove(function (err) {
                                if(err) throw err;
                              });
                            }
                          }
                        });
                      user.war.activity_war = 0;
                      user.ship.plavanie = 0;
                      user.war.user_war = 0;
                      res.locals.plavanie_message = 0;
                    } else {
                      if (user.ship.speed / enemy.ship.speed >= 1.3) {
                        user.war.waiting = 30;
                        user.war.last_action = new Date;
                        user.war.activity_war = 5;
                      } else {
                        err_message_low = 'Недостаточно скорости! Требуемое значение: '+Math.floor(enemy.ship.speed*1.3*100)/100;
                      }
                    }

                    user.save(function (err) {
                      if (err) throw err;
                    });
                    callback(null, err_message_low, user, null, null, null);
                  });
                }
              }
            }
            // BOARD
            else if (user.war.activity_war == 4) {
              var board_value = req.body.board;
              if (board_value == 0) {
                user.war.waiting = 120;
                user.war.activity_war = 3;
                user.war.last_action = new Date;
                user.save(function (err) {
                  if(err) return next(err);
                });
                callback(null, err_message_low, user, null, null, null);
              } else {
                callback(null, err_message_low, user, null, null, null);
              }
            }
            // AWAY
            else if (user.war.activity_war == 5) {
              var away_value = req.body.away;
              if (away_value == 0) {
                user.war.waiting = 120;
                user.war.activity_war = 3;
                user.war.last_action = new Date;
                user.save(function (err) {
                  if(err) return next(err);
                });
                callback(null, err_message_low, user, null, null, null);
              } else {
                callback(null, err_message_low, user, null, null, null);
              }
            }
            // ELSE
            else {
             callback(null, err_message_low, user, null, null, null);
            }
          } else {
           callback(null, err_message_low, user, null, null, null);
         }
        }
      ], function (err, err_message_low, user, info_war, enemy_war3, logWars) {

        async.waterfall([
            function(callback){
              if (!enemy_war3 && user.war.activity_war >= 1 && user.war.activity_war <= 5 && user.war.user_war != 'bot') {
                  User.findOne({username: user.war.user_war},function (err, enemy) {
                    if (err) throw err;
                    callback(null, enemy);
                  });
              } else {
                callback(null, null);
              }
          },
            function (enemy, callback) {
              if (user.war.activity_war >= 3 && !logWars) {
                //    LogWar
                LogWar.find_logs(user.username, user.war.user_war, function (err, logWars) {
                  if (err) {
                    if (err instanceof AuthError_journal) {
                      return next(new HttpError(403, err.message));
                    } else {
                        return next(err);
                    }
                    }
                  if (!logWars[0]) {
                    logWars[0] = 0;
                  }

                    var position = 0;
                    var logWars_poryadok = [];
                    for (var i = 0; i < logWars.length; i++) {
                      for (var j = 0; j < logWars_poryadok.length; j++) {
                          if (logWars_poryadok[j].created < logWars[i].created) {
                            position = j;
                            break;
                          }
                      }
                        logWars_poryadok.splice(position, 0, logWars[i]);
                        position=logWars_poryadok.length;
                    }
                callback(null, enemy, logWars_poryadok);

                  });
              } else {
                callback(null, enemy, null);
              }
            }
        ], function (err, enemy, logWars3) {
        res.locals.logWars = null;
        if (user.war.activity_war >= 3) {
          if (logWars) {
            res.locals.logWars = logWars;
          } else {
            res.locals.logWars = logWars3;
          }
        }
        res.locals.enemy_name = null;
        res.locals.enemy_avatar = null;
        res.locals.ship_enemy = null;
        res.locals.hull_enemy = null;
        res.locals.sails_enemy = null;
        res.locals.team_enemy = null;
        res.locals.speed_enemy = null;
        res.locals.mobility_enemy = null;
        var url = 'poisk';
        if (user.war.activity_war >= 1 && user.war.activity_war <= 5) {
          var names_images = [];
          var alt_images = [];
          var abilities = require('../../middleware/game/abilities').abilities;
          if (req.user.abilities.damage_hull.activity > 0) {
            names_images.push('Korpus');
            alt_images.push(abilities.damage_hull.name);
          }
          if (req.user.abilities.damage_sails.activity > 0) {
            names_images.push('parus');
            alt_images.push(abilities.damage_sails.name);
          }
          if (req.user.abilities.damage_team.activity > 0) {
            names_images.push('komanda');
            alt_images.push(abilities.damage_team.name);
          }
          if (req.user.abilities.critical_shot.activity > 0) {
            names_images.push('krit');
            alt_images.push(abilities.critical_shot.name);
          }
          if (req.user.abilities.masters_boarding.activity > 0) {
            names_images.push('abordazh');
            alt_images.push(abilities.masters_boarding.name);
          }
          if (req.user.abilities.musket_volley.activity > 0) {
            names_images.push('zalp');
            alt_images.push(abilities.musket_volley.name);
          }
          if (req.user.abilities.protection_ship.activity > 0) {
            names_images.push('zaschita');
            alt_images.push(abilities.protection_ship.name);
          }
          if (req.user.abilities.quick_fix.activity > 0) {
            names_images.push('pochinka');
            alt_images.push(abilities.quick_fix.name);
          }
          if (req.user.abilities.improved_treatment.activity > 0) {
            names_images.push('lechenie');
            alt_images.push(abilities.improved_treatment.name);
          }
          if (req.user.abilities.speed_ship.activity > 0) {
            names_images.push('skorost');
            alt_images.push(abilities.speed_ship.name);
          }
          if (req.user.abilities.learnbility.activity > 0) {
            names_images.push('opyt');
            alt_images.push(abilities.learnbility.name);
          }
          if (req.user.abilities.maneuverability_ship.activity > 0) {
            names_images.push('manevrennost');
            alt_images.push(abilities.maneuverability_ship.name);
          }
          if (req.user.abilities.fast_recharge.activity > 0) {
            names_images.push('perezaryadka');
            alt_images.push(abilities.fast_recharge.name);
          }
          res.locals.names_images = names_images;
          res.locals.alt_images = alt_images;

          if (user.war.user_war == 'bot') {
            res.locals.enemy_name = user.boti.username;
            res.locals.enemy_avatar = user.boti.avatar_index;
            res.locals.hull_enemy = user.boti.ship.hull;
            res.locals.sails_enemy = user.boti.ship.sails;
            res.locals.team_enemy = user.boti.ship.team.sailors +
                   user.boti.ship.team.boarders + user.boti.ship.team.gunners;
            res.locals.speed_enemy = user.boti.ship.speed;
            res.locals.mobility_enemy = user.boti.ship.mobility;
          } else {
              if (!enemy_war3) {
                res.locals.enemy_name = enemy.username;
                res.locals.enemy_avatar = enemy.avatar_index;
                res.locals.ship_enemy = ship[enemy.ship.index_ship].name;
                res.locals.hull_enemy = enemy.ship.hull;
                res.locals.sails_enemy = enemy.ship.sails;
                res.locals.team_enemy = enemy.ship.team.sailors +
                       enemy.ship.team.boarders + enemy.ship.team.gunners;
                res.locals.speed_enemy = enemy.ship.speed;
                res.locals.mobility_enemy = enemy.ship.mobility;
              } else {
                res.locals.enemy_name = enemy_war3.username;
                res.locals.enemy_avatar = enemy_war3.avatar_index;
                res.locals.ship_enemy = ship[enemy_war3.ship.index_ship].name;
                res.locals.hull_enemy = enemy_war3.ship.hull;
                res.locals.sails_enemy = enemy_war3.ship.sails;
                res.locals.team_enemy = enemy_war3.ship.team.sailors +
                       enemy_war3.ship.team.boarders + enemy_war3.ship.team.gunners;
                res.locals.speed_enemy = enemy_war3.ship.speed;
                res.locals.mobility_enemy = enemy_war3.ship.mobility;
              }
          }
          if (user.war.activity_war == 1) {
            url = 'waiting_confirmation';
          } else if (user.war.activity_war == 2) {
            url = 'waiting_battle';
          } else if (user.war.activity_war == 3) {
            var sek_time_recharge = 0;
            var chance_explosion = 0;
            var time_recharge = require('../../middleware/game/time_recharge');
            time_recharge.Time_recharge(req, res, sek_time_recharge, chance_explosion, req.user);
            url = 'battle';
          } else if (user.war.activity_war == 4) {
            url = 'board';
          } else if (user.war.activity_war == 5) {
            url = 'departure';
          }
        } else if (user.war.activity_war == 6) {
          res.locals.info_war = null;
          if (info_war) {
            res.locals.info_war = info_war;
          }
          url = 'return_home';
        } else if (user.ship.plavanie != 1) {
          url = 'plavanie';
        }
        user.last_action = new Date;
        res.locals.user = user;
        res.render('./plavanie/'+url, {err_message_low:err_message_low});
      });
        });
  });
};
