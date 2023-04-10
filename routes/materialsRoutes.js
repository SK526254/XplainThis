const express = require('express')
const router = express.Router()
const protected = require("../utils/protected")

router.get("/" , protected ,(req , res)=>{
    res.render("materials/materials")
})



// exporting whole routes  
module.exports  =  router 