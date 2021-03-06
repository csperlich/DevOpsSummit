var user = require('../controllers/user.controller');
var admin = require('../controllers/admin.controller.js');
var conference = require('../controllers/conference.controller.js');

module.exports = function(app) {

  app.route('/admin/login')
    .get(function(req, res, next) {
      res.render('common/pages/admin/login');
    })
    .post(admin.adminByEmail, admin.validate, admin.startSession,
      function(req, res, next) {
        res.redirect('/admin/home');
      });

  app.route('/admin/register')
    .get(function(req, res, next) {
      res.render('common/pages/admin/registration');
    }).post(admin.create, function(req, res, next) {
      res.render('common/pages/admin/registration-success');
    });

  app.route('/admin/home')
    .get(admin.checkForSession, function(req, res, next) {
      res.render('common/pages/admin/home');
    });

  app.route('/admin/attendees')
    .post(admin.checkForSession, conference.conferenceByName, user.usersByConference,
      function(req, res, next) {
        console.log(req.attendees);
        console.log(req.conference);
        res.render('common/pages/admin/attendee-list', {
          attendees: req.attendees
        });
      });
};
