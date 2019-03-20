

exports.get = function (req, res) {
var err_message_low = '';

  res.render('./plavanie/plavanie', {err_message_low:err_message_low});
};
