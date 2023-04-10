const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
	userAnswerer: {
		type: String,
		required: [false, "The user should have a name"],
	},
	answer: {
		type: String,
		required: [true, "The answer should have minimum of 3 character"],
	},
	upvotes: {
		type: Number,
		default: 0,
	},
	downvotes: {
		type: Number,
		default: 0,
	},
});


answerSchema.virtual('votes').get(function () {
	return (this.upvotes -this.downvotes)
})
const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
