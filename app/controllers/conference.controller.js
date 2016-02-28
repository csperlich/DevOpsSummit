var Conference = require('mongoose').model('Conference');

exports.conferenceByName = function(req, res, next) {
  console.log('conferenceByName');
  Conference.findOne({
    name: req.body.conferenceName
  }, function(err, conference) {
    if (err) {
      console.log('conference by name failure');
      return next(err);
    } else {
      req.conference = conference;
      next();
    }
  });
};
