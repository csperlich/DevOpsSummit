var User = require('mongoose').model('User');

exports.create = function(req, res, next) {
  console.log('in create');
	var user = new User(req.body);
	user.save(function(err, user) {
		if (err) {
			return next(err);
		} else {
      req.user = user;
      next();
		}
	});
};

exports.register = function(req, res, next) {
  console.log('in register');
  User.update(
    { _id: req.user._id },
    { $addToSet: { registrations: req.conference._id } },
    function(err) {
      if (err) {
        return next(err);
      } else {
        res.json({message:'successfully registered'});
      }
    }
  );
};

exports.unRegister = function(req, res, next) {
  console.log('in unregister');
  User.update(
    { _id: req.user._id },
    { $pull: { registrations: req.conference._id } },
    function(err) {
      if (err) {
        return next(err);
      } else {
        res.json({message:'successfully un-registered'});
      }
    }
  );
};

exports.userByEmail = function(req, res, next) {
  console.log('in userByEmail');
	User.findOne({
		email: req.query.email || req.body.email
	}, function(err, user) {
		if (err) {
			return next(err);
		} else {
			req.user = user;
			next();
		}
	});
};
