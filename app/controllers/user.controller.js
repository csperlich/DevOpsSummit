var User = require('mongoose').model('User'),
nodemailer = require('nodemailer'),
config = require('../../config/config'),
emailCred = config.email,
transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: emailCred
}, {
  from: emailCred.user,
  headers: {}
});

exports.create = function(req, res, next) {
  var user = new User(req.body);
  user.save(function(err, user) {
    if (err) {
      return next(err);
    } else {
      console.log(user);
      req.user = user;
      next();
    }
  });
};

exports.register = function(req, res, next) {

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
        req.body.confirmationNumber = confirmationNumber;
        next();
      }
    }
  );
};

exports.unRegister = function(req, res, next) {
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

exports.renderReservation = function(req, res, next) {
  res.render('common/pages/reservation-page', {user: req.user,
    conference: req.conference, confirmationNumber: req.body.confirmationNumber});
  };

  exports.usersByConference = function(req, res, next) {
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

  exports.sendConfirmationEmail = function(req, res, next) {
    console.log('user.controller.sendconfirmationEmail');
    console.log(req.user.email);
    console.log(req)
    transporter.sendMail({
      from: emailCred.user,
      to: req.user.email,
      subject: 'Acme Summit Confirmation',
      html: '<h3>' + req.user.name + ',</h3>' +
      '<p>Thank you for registering for the ' + req.conference.name + '!</p>' +
      '<p>Your confirmation number is: ' + req.body.confirmationNumber + '</p>' +
      "<p>We can't wait to see you at the DevOps conference!</p><br>" +
      'Sincerely,<br> The Acme Global Summit Team'
    }, function(err, info) {
      if(err) {
      } else {
      }
    });
    next();
  };

  exports.checkIfAlreadyRegisterd = function(req, res, next) {
    User.findOne({
      'registrations.registrationID': req.conference._id,
      email:req.body.email
    }, function(err, user) {
      if(err) {
        return next(err);
      }
      if (user) {
        return next({errmsg:"already registerd"});
      }
      next();
    });
  };

  exports.verifyConfirmationNumber = function(req, res, next) {
      var isUserConfirmationNum = false;
      for (var i = 0; i < req.user.registrations.length; i++) {
        if (req.user.registrations[i].confirmationNumber === req.body.confirmationNumber) {
          isUserConfirmationNum = true;
          break;
        }
      }
      if (isUserConfirmationNum) {
        return next();
      }
      next({errmsg:"not a valid confirmation number"});
  };
