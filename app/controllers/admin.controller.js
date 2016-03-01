var Admin = require('mongoose').model('Admin');

exports.validate = function(req, res, next) {
  console.log('admin.controller.validate');
  next();
};

exports.create = function(req, res, next) {
  console.log('in create');

  var email = req.body.email;
  var password = req.body.password;
  console.log(req.body);
  var admin = new Admin({email:email, password:password});
  admin.save(function(err, admin) {
    if (err) {
      return next(err);
    } else {
      next();
    }
  });
};
