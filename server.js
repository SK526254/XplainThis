if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();  
}

const express  = require("express")
const app = express()
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require('body-parser')

// importing whole routes from the index.js file in Routes
const indexRouter = require("./routes/index")
const topicRouter = require("./routes/topicRoutes")
const aboutRouter = require("./routes/aboutRoutes")
const materialsRouter = require("./routes/materialsRoutes")

app.use(bodyParser.urlencoded({extended : true}))

app.set("view engine" , "ejs")
// setting views folder as the views
app.set("views" , __dirname + "/views")
// setting the layout file for entire ejs files
app.set("layout" , "layouts/layout")
app.use(expressLayouts)
app.use(express.static("public"))

const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DATABASE_URL , {useNewUrlParser : true})
const db = mongoose.connection
db.on('error' , error =>console.error(error))
db.once('open' , () =>console.log("connected to mongoose"))

// using starting routing point by App
app.use("/" , indexRouter)
app.use("/topics" , topicRouter)
app.use("/about" , aboutRouter)
app.use("/materials" , materialsRouter)


app.use("*" , (req , res)=>{
    res.status(404).json({error : "Not Found"})
})
app.listen(3000 || process.env.PORT  , ()=>{
    console.log("Server stated");
})