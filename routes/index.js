const express = require('express')
const bodyParser = require("body-parser")
const router = express.Router()

router.get("/" ,(req , res)=>{
    res.render("index")
})



// exporting whole routes  
module.exports  =  router 