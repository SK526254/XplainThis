const mongoose = require("mongoose")

const materailSchema = new mongoose.Schema({
    fileName :{
        type : String,
        required:true
    } , 
    file:{
        type:file,
        required : true
    }

})

const Material = mongoose.model("Material" , materailSchema)
module.exports = Material