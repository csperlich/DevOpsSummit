var Admin = require('mongoose').model('Admin');

exports.validate = function(req, res, next) {
  console.log('admin.controller.validate');
  if (req.admin.authenticate(req.body.password)) {
    next();
  } else {
    next({errmsg:"password does not match admin email"});
  }
};

exports.adminByEmail = function(req, res, next) {
  console.log('admin.controller.findByEmail');
  Admin.findOne({
    email: req.query.email || req.body.email
  }, function(err, admin) {
    if (err) {
      return next(err);
    } else {
      if (!admin) {
        next({errmsg:"no user available for email address: " + email})
      }
      req.admin = admin;
      next();
    }
  });
};

exports.create = function(req, res, next) {
  console.log('in create');

  var email = req.body.email;
  var password = req.body.password;
  console.log("email " + email);
  console.log("password " + password);
  var admin = new Admin({email:email, password:password});
  admin.save(function(err, admin) {
    if (err) {
      return next(err);
    } else {
      next();
    }
  });
};

exports.startSession = function(req, res, next) {
  req.session.admin = req.admin;
  next();
};

exports.checkForSession = function(req, res, next) {
  console.log("admin.controller.checkForSession");
  if (!req.session.admin) {
    res.render('common/pages/forbidden');
  } else {
    next();
  }
};
