var user = require('../controllers/user.controller');
var conference = require('../controllers/conference.controller.js');

module.exports = function(app) {

  app.route('/user/register')
    .post(user.create, conference.conferenceByName, user.register);

  app.route('/user/unregister')
    .post(user.userByEmail, conference.conferenceByName, user.unRegister);

};
