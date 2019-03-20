module.exports.Rating_update = function (user) {

  if(user.rating.rating == 0) {
    if(user.rating.number_rating >= 40)
      user.point_rating = user.point_rating + 3;
    else if(user.rating.number_rating >= 15)
        user.point_rating = user.point_rating + 1;
  } else if (user.rating.rating == 1) {
    user.point_rating = user.point_rating + 30;
  } else if (user.rating.rating == 2) {
    user.point_rating = user.point_rating + 20;
  } else if (user.rating.rating == 3) {
    user.point_rating = user.point_rating + 15;
  } else if (user.rating.rating > 3 && user.rating.rating <= 10) {
    user.point_rating = user.point_rating + 10;
  } else if (user.rating.rating > 10 && user.rating.rating <= 30) {
    user.point_rating = user.point_rating + 5;
  }

user.rating.number_rating = 0;
var date_now = new Date();
user.rating.created =  new Date(date_now.getFullYear(), date_now.getMonth(), date_now.getDate())
};
