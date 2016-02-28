var mongoose = require('mongoose'),
	  Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
  address: {
        type: String
  },
	phone: {
    type: String
  },
	email: {
		type: String,
		index: true,
    required: true,
    unique: true,
		match: /.+\@.+\..+/
	},
  company: {
    type: String,
    required: true
  },
	title: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	registrations: [{
      registrationID: Schema.Types.ObjectId
  }]
});

mongoose.model('User', UserSchema);
