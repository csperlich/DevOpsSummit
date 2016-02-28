var mongoose = require('mongoose'),
	  Schema = mongoose.Schema;

var ConferenceSchema = new Schema({
	name: {
		type: String,
		required: true
	},
  address: {
        type: String
  },
	date: {
		type: Date,
		required: true
	}
});

mongoose.model('Conference', ConferenceSchema);
