var Admin = require('mongoose').model('Admin');

exports.validate = function(req, res, next) {
  console.log('admin.controller.validate');
  next();
};

exports.create = function(req, res, next) {
  console.log('in create');
  var name = req.body.name;
  var password = req.body.password;
  var admin = new Admin({name:name, password:password});
  admin.save(function(err, admin) {
    if (err) {
      return next(err);
    } else {
      next();
    }
  });
};
