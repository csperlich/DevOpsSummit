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
    {
      $addToSet: {
        registrations: {
          registrationID: req.conference._id,
          confirmationNumber: User.getNextConfirmationNumber()
        }
      }
    },
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
    {
      $pull: {
        registrations: {
          registrationID: req.conference._id
        }
      }
    },
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

exports.userByConfirmationNumber = function(req, res, next) {
  console.log('in userByConfirmationNumber');
  User.findOne({
    'registrations.confirmationNumber': req.body.confirmationNumber
  }, function(err, user) {
    if (err) {
      return next(err);
    } else {
      req.user = user;
      for (var i = 0; i < user.registrations.length; i++) {
        if (user.registrations[i].confirmationNumber === req.body.confirmationNumber) {
          req.conferenceID= user.registrations[i].registrationID;
          break;
        }
      }
      next();
    }
  });
};

exports.sendReservation = function(req, res, next) {
  res.json(req.conference);
};
