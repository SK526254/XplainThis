const express = require('express')
const router = express.Router()

router.get("/" ,(req , res)=>{
    res.render("about/about.ejs")
})



// exporting whole routes  
module.exports  =  router 