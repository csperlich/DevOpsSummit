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
  var confirmationNumber = User.getNextConfirmationNumber();
  User.update(
    { _id: req.user._id },
    {
      $addToSet: {
        registrations: {
          registrationID: req.conference._id,
          confirmationNumber: confirmationNumber
        }
      }
    },
    function(err) {
      if (err) {
        return next(err);
      } else {
        req.confirmationNumber = confirmationNumber;
        next();
        //res.json({user: req.user, conference: req.conference, confirmationNumber: confirmationNumber});
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
      if (!user) {
        next({errmsg:"no user available for email address: " + req.query.email})
      }
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
      if (!user) {
        return next({errmsg: "invalid confirmation number"});
      }
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
  res.render('common/pages/reservation-page', {user: req.user, conference: req.conference, confirmationNumber: req.confirmationNumber});
};

exports.usersByConference = function(req, res, next) {
  console.log('user.controller.usersByConferenceName');
  console.log(req.conference._id);
  User.find({
    'registrations.registrationID': req.conference._id
  }, function(err, attendees) {
    if (err) {
      return next(err);
    } else {
      req.attendees = attendees;
      next();
    }
  });
};
