const express = require("express");
const bcrypt = require('bcryptjs')
const userRouter = express.Router();
const protected = require("../utils/protected")
// requiring User model
const User = require("../models/usersModel");

// getting user 
userRouter.get("/", async (req , res)=>{

  try {
    const user = await User.findOne({_id : req.session.userAuth})
    res.render("user/userProfile.ejs")
  } catch (error) {
    res.redirect(`/`)
  }

  
});
// get router for getting regiser page
userRouter.get("/register" ,  (req , res)=>{
  res.render("user/register")
})

// 
userRouter.get("/login" ,  (req , res)=>{

  res.render('user/login')
})

// registering a user 
userRouter.post("/register" , async (req , res)=>{

  const {fullname  ,email , password} = req.body

   if(!fullname || !email || !password){
    return res.render("user/register" , {errorMessage : "All fields are required..!"})
  }

  try {
    const userFound = await User.findOne({email})
    if(userFound){
      return res.render("user/register" , {
        errorMessage : "Email already Exists"
      })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password , salt);

    const userCreated = await User.create({
      name : fullname , email , password : hashedPass
    })
    res.render("user/login")
    
  } catch (error) {
    console.log(error.message);
    res.redirect(`/user/register` ,{errorMessage : error.message})
    
  }



  
})

// logging in a user
userRouter.post("/login" , async (req , res)=>{
  const {email , password} = req.body
  if(!email || !password){
    return res.render('user/login' , {errorMessage : "All fields are required..!"})
  }

  try {

    const userFound = await User.findOne({email})
    if(!userFound){
      return res.render('user/login' , {errorMessage : "Invalid Login Credentials"})
    }
    const isPasswordValid = await bcrypt.compare( password , userFound.password)
    if(!isPasswordValid){
      return res.render('user/login' , {errorMessage : "Invalid Login Credentials"})
    }

// saving the authenticated user into the session
req.session.userAuth = userFound._id
res.redirect('/')
  } catch (error) {
     res.render('user/login' , {errorMessage : ""})

  }

})

// updating user
userRouter.get("/update" ,  (req , res)=>{
  res.send("<h1>Update User Profile</h1>")
})
// updating user
userRouter.put("/update" ,  (req , res)=>{
  res.json({
    status : "success",
    message : "user updated"
  })
})
// updating user
userRouter.get("/update-password" ,  (req , res)=>{
  res.send("<h1>Update User-password</h1>")
})
// updating password 
userRouter.put("/update-password" ,  (req , res)=>{
  res.json({
    status : "success",
    message : "user password updated"
  })
})
// logging out user
userRouter.get("/logout" ,  (req , res)=>{
  res.json({
    status : "success",
    message : "user logged out"
  })
})

module.exports = userRouter;
