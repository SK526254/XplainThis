const express = require('express')
const bodyParser = require("body-parser")
const router = express.Router()
const protected = require("../utils/protected")

router.get("/"  , protected ,(req , res)=>{
    res.render("index")
})



// exporting whole routes  
module.exports  =  router 