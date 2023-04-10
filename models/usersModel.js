const mongoose = require('mongoose');

const userSchema = new  mongoose.Schema({
    name: {
		type: String,
		required: [true, 'User should have a name']
	},
	email: {
		type: String,
		required: [true, 'User should have an email'],
		unique: true,
		lowercase: true,
		// validate: [validator.isEmail, 'Please provide a valid email']
	},
	role: {
		type: String,
		enum: ['Student', 'Professor', 'Admin'],
		default: 'Student'
	},
	questionsAsked: {
		type:[mongoose.Schema.Types.ObjectId],
		ref : "Question"	
	},
	questionsAnswered: {
		type: Number,
		default: 0
	},
	password: {
		type: String,
		required: [true, 'Please provide a password'],
		minlength: 8
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type: String,
		default: true
	}
})


const User = mongoose.model('User' , userSchema)

module.exports = User;