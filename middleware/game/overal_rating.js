var User = require('../../models/user').User;

module.exports.Overal_rating = function (docs) {

  for (var i = 0; i < docs.length; i++) {
    var number_hi = 0;
    for (var j = 0; j < docs.length; j++) {
        if (docs[i].rating.number_rating < docs[j].rating.number_rating) {
          number_hi++;
        } else if (i > j && docs[i].rating.number_rating == docs[j].rating.number_rating
                  && docs[j].rating.rating == docs[i].rating.rating && docs[j].rating.rating != 0 || docs[i].rating.number_rating == docs[j].rating.number_rating
                  && docs[j].rating.rating < docs[i].rating.rating && docs[j].rating.rating != 0 ||
                  docs[i].rating.number_rating == docs[j].rating.number_rating
                            && docs[j].rating.rating > docs[i].rating.rating && docs[i].rating.rating == 0) {
          number_hi++;
        }
        if (number_hi == 30) break;
    }

    if (number_hi >= 30 && docs[i].rating.rating == 0) continue;
    else if(number_hi >= 30) docs[i].rating.rating = 0;
    else {
       docs[i].rating.rating = number_hi+1;
    }
    docs[i].save(function (err) {
      if (err) throw err;
    });
  }

};
