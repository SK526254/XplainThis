const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    questions:{
        type: [mongoose.Schema.Types.ObjectId],
        ref : "Question",
    },

    questionsCount:{
        type:Number,
        required:false
    }

})

const Topic = mongoose.model('Topic' , topicSchema)

module.exports = Topic