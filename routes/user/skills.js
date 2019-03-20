
exports.get = function (req, res,next) {

res.locals.max_number_marksmanship = Math.floor(Math.pow(req.user.skills.marksmanship+1, 2.66));

res.locals.max_number_protection = Math.floor(Math.pow(req.user.skills.protection+1, 2.55));

res.locals.max_number_resistance = Math.floor(Math.pow(req.user.skills.resistance+1, 2.58));

res.locals.max_number_boarding = Math.floor(Math.pow(req.user.skills.boarding+1, 2.64));

res.locals.max_number_navigation = Math.floor(Math.pow(req.user.skills.navigation+1, 2.57));

res.render('./user/skills');
};
