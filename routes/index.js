var checkAuth = require('../middleware/checkAuth');
var loadUser = require('../middleware/loadUser');

module.exports = function (app) {

app.get('/', loadUser, require('./frontpage').get);

app.get('/login', loadUser, require('./login').get);
app.post('/login', loadUser, require('./login').post);

app.get('/registration', loadUser, require('./registration').get);
app.post('/registration', loadUser, require('./registration').post);

app.post('/logout', loadUser, checkAuth, require('./logout').post);

app.get('/logbook', loadUser, checkAuth, require('./logbook').get);

app.get('/assignments', loadUser, checkAuth, require('./assignments').get);
app.post('/assignments', loadUser, checkAuth, require('./assignments').post);

app.get('/city', loadUser, checkAuth, require('./city').get);

app.get('/shop', loadUser, checkAuth, require('./shop').get);

app.get('/shop/confirmation', loadUser, checkAuth, require('./shop_confirmation').get);
app.post('/shop/confirmation', loadUser, checkAuth, require('./shop_confirmation').post);

app.get('/assignments/confirmation', loadUser, checkAuth, require('./assignments_confirmation').get);
app.post('/assignments/confirmation', loadUser, checkAuth, require('./assignments_confirmation').post);

app.get('/tavern', loadUser, checkAuth, require('./tavern').get);
app.post('/tavern', loadUser, checkAuth, require('./tavern').post);

app.get('/verf', loadUser, checkAuth, require('./verf').get);

app.get('/verf/ships_light', loadUser, checkAuth, require('./ships').get);
app.get('/verf/ships_5', loadUser, checkAuth, require('./ships').get);
app.get('/verf/ships_4', loadUser, checkAuth, require('./ships').get);
app.get('/verf/ships_3', loadUser, checkAuth, require('./ships').get);

app.get('/verf/ships/confirmation', loadUser, checkAuth, require('./ships_confirmation').get);
app.post('/verf/ships/confirmation', loadUser, checkAuth, require('./ships_confirmation').post);

app.get('/verf/guns', loadUser, checkAuth, require('./guns').get);
app.post('/verf/guns', loadUser, checkAuth, require('./guns').post);

app.get('/bank', loadUser, checkAuth, require('./bank').get);

app.get('/bank/confirmation', loadUser, checkAuth, require('./bank_confirmation').get);
app.post('/bank/confirmation', loadUser, checkAuth, require('./bank_confirmation').post);

app.get('/alchimik', loadUser, checkAuth, require('./alchimik').get);

app.get('/alchimik/confirmation', loadUser, checkAuth, require('./alchimik_confirmation').get);
app.post('/alchimik/confirmation', loadUser, checkAuth, require('./alchimik_confirmation').post);

app.get('/college', loadUser, checkAuth, require('./college').get);

app.get('/college/skills', loadUser, checkAuth, require('./college_skills').get);
app.post('/college/skills', loadUser, checkAuth, require('./college_skills').post);

app.get('/college/attack_abilities', loadUser, checkAuth, require('./college_abilities').get);
app.get('/college/protection_abilities', loadUser, checkAuth, require('./college_abilities').get);
app.get('/college/ship_abilities', loadUser, checkAuth, require('./college_abilities').get);
app.get('/college/abilities/info', loadUser, checkAuth, require('./college_abilities_info').get);

app.get('/college/abilities/confirmation', loadUser, checkAuth, require('./abilities_confirmation').get);
app.post('/college/abilities/confirmation', loadUser, checkAuth, require('./abilities_confirmation').post);

app.get('/pochta/last', loadUser, checkAuth, require('./pochta/last').get);

app.get('/pochta', loadUser, checkAuth, require('./pochta/pochta').get);
app.post('/pochta', loadUser, checkAuth, require('./pochta/pochta').post);

app.get('/pochta/noted', loadUser, checkAuth, require('./pochta/noted').get);

app.get('/pochta/noted/confirmation', loadUser, checkAuth, require('./pochta/noted_confirmation').get);
app.post('/pochta/noted/confirmation', loadUser, checkAuth, require('./pochta/noted_confirmation').post);

app.get('/pochta/support', loadUser, checkAuth, require('./pochta/support').get);
app.post('/pochta/support', loadUser, checkAuth, require('./pochta/support').post);

app.get('/user', loadUser, checkAuth, require('./user/user').get);
app.get('/user/skills', loadUser, checkAuth, require('./user/skills').get);
app.get('/user/abilities', loadUser, checkAuth, require('./user/abilities').get);
app.post('/user/abilities', loadUser, checkAuth, require('./user/abilities').post);
app.get('/user/alchimik', loadUser, checkAuth, require('./user/alchimik').get);
app.post('/user/alchimik', loadUser, checkAuth, require('./user/alchimik').post);
app.get('/user/ship', loadUser, checkAuth, require('./user/ship').get);
app.get('/user/avatar', loadUser, checkAuth, require('./user/avatar').get);
app.post('/user/avatar', loadUser, checkAuth, require('./user/avatar').post);
app.get('/user/recharge', loadUser, checkAuth, require('./user/recharge').get);
app.post('/user/recharge', loadUser, checkAuth, require('./user/recharge').post);
app.get('/user/info', loadUser, checkAuth, require('./user/info').get);
app.post('/user/noted', loadUser, checkAuth, require('./user/noted').post);
app.get('/user/settings', loadUser, checkAuth, require('./user/settings').get);
app.post('/user/settings', loadUser, checkAuth, require('./user/settings').post);

app.get('/gold', loadUser, checkAuth, require('./gold').get);
app.get('/clan', loadUser, checkAuth, require('./clan').get);

app.get('/poisk', loadUser, checkAuth, require('./poisk').get);
app.post('/poisk', loadUser, checkAuth, require('./poisk').post);

app.get('/reyting', loadUser, checkAuth, require('./reyting').get);

app.get('/online', loadUser, checkAuth, require('./online').get);

app.get('/plavanie', loadUser, checkAuth, require('./plavanie/plavanie').get);

app.get('/plavanie/battle', loadUser, checkAuth, require('./plavanie/battle').get);
app.post('/plavanie/battle', loadUser, checkAuth, require('./plavanie/battle').post);

app.get('/plavanie/assignments', loadUser, checkAuth, require('./plavanie/assignments').get);
app.post('/plavanie/assignments', loadUser, checkAuth, require('./plavanie/assignments').post);

app.post('/training', loadUser, checkAuth, require('./user/training').post);

app.get('/promo', loadUser, checkAuth, require('./promo').get);
app.post('/promo', loadUser, checkAuth, require('./promo').post);

};
