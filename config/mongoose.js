var	config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {

	var db = mongoose.connect(config.db);

	require('../app/models/users/user.model');
	require('../app/models/conferences/conference.model');

	return db;
};
