var Conference = require('mongoose').model('Conference');

exports.conferenceByName = function(req, res, next) {
  console.log('conferenceByName');
  Conference.findOne({
    name: req.body.conferenceName
  }, function(err, conference) {
    if (err) {
      return next(err);
    } else {
      if (!conference) {
        next({errmsg:"invalid conference name"});
      }
      req.conference = conference;
      next();
    }
  });
};

exports.conferenceById = function(req, res, next) {
  console.log('conferenceById');
  Conference.findOne({
    _id: req.conferenceID
  }, function(err, conference) {
    if (err) {
      return next(err);
    } else {
      req.conference = conference;
      next();
    }
  });
};
