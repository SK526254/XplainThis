const protected = (req , res , next)=>{
    if(req.session.userAuth){
        next()
    }else {
        return res.render('user/login' , {errorMessage : ""})
    }
}
module.exports = protected