var user = require('../controllers/user.controller');
var admin = require('../controllers/admin.controller.js');

module.exports = function(app) {

  app.route('/admin/login')
    .get(function(req, res, next) {
      res.render('common/pages/admin-login');
    })
    .post(admin.validate);

  app.route('/admin/register')
    .get(function(req, res, next) {
      res.render('common/pages/admin-registration');
    }).post(admin.create, function(req, res, next) {
      res.render('common/pages/admin-registration-success');
    });

};
