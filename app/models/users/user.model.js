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
      registrationID: Schema.Types.ObjectId,
			confirmationNumber: {
				type: String,
				index: true
			}
  }]
});

UserSchema.statics.chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
UserSchema.statics.getNextConfirmationNumber = function() {
	var letters = [];
	for (var i = 0; i < 8; i++) {
		letters.push(UserSchema.statics.chars[Math.floor(Math.random() * UserSchema.statics.chars.length)]);
	}

	//unix time millisecons, of length 13 for the foreseeable future
	var numbers = new Date().getTime().toString().split('');
	var output = letters.concat(numbers);

    var i = output.length;
    while( i > 1) {
    	i = i - 1;
        var j = Math.floor(Math.random() * i);
        var temp = output[j];
        output[j] = output[i];
        output[i] = temp;
	}
	return output.join('');
};
mongoose.model('User', UserSchema);
