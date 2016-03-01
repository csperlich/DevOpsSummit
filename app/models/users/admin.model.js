var mongoose = require('mongoose'),
	crypto = require('crypto'),
	Schema = mongoose.Schema;

var AdminSchema = new Schema({
	name:  {
    type: String,
    unique: true,
    required: 'Admin name is required',
    trim: true
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
  console.log(this);
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
  return this.password === this.hashPassword(password);
};


mongoose.model('Admin', AdminSchema);
