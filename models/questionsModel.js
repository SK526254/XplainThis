const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
	userQuestioner : {
		type: String,
		required: [false, 'The user should have a name']
	},
	questionTitle: {
		type: String,
		required: [false, 'The question should have title']
	},
	questionDescription: String,
	questionTag: {
		type: String,
		required: [false, 'The question should have a tag']
	},
	answers:{
		type: [mongoose.Schema.Types.ObjectId],
		ref : "Answer"
	},
    topic:{
        type: mongoose.Schema.Types.ObjectId,
        required :true,
        ref : 'Topic'
    }
});



// questionSchema.virtual('count').get( async function() {
// 	ref:Question,
//     return await collection.count();
// })
// questionSchema.virtual('questionCount').get(function() {
    
// });
const Question = mongoose.model('Question', questionSchema);

module.exports = Question;