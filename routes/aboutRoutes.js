const express = require('express')
const router = express.Router()
const protected = require("../utils/protected")

router.get("/" , protected ,(req , res)=>{
    res.render("about/about.ejs")
})



// exporting whole routes  
module.exports  =  router 