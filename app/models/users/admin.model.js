var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

var AdminSchema = new Schema({
  email: {
		type: String,
		index: true,
    required: true,
    unique: true,
		match: /.+\@.+\..+/
	},
  isValidated: {
    type: Boolean,
    default: false
  },
	password: {
		type: String,
    required: true,
		validate: [
			function(password) {
				return password && password.length > 6;
			}, 'Password should be longer'
		]
	},
	salt: {
		type: String
	},
	created: {
		type: Date,
		default: Date.now
	}
});

AdminSchema.pre('save', function(next) {
	if (this.password) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

AdminSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

AdminSchema.methods.authenticate = function(password) {
  console.log('in authenticate');
  console.log(this.hashPassword(password));
  return this.password === this.hashPassword(password);
};


mongoose.model('Admin', AdminSchema);
