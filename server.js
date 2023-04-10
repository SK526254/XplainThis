if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();  
}

const express  = require("express")
const session = require("express-session")
const MongoStore = require('connect-mongo')
const app = express()
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require('body-parser')

// connecting to database
require('./config/dbConnect')

// importing whole routes from the index.js file in Routes
const indexRouter = require("./routes/index")
const topicRouter = require("./routes/topicRoutes")
const aboutRouter = require("./routes/aboutRoutes")
const materialsRouter = require("./routes/materialsRoutes");
const userRouter = require('./routes/userRoutes');


app.set("view engine" , "ejs")
// setting views folder as the views
app.set("views" , __dirname + "/views")
// setting the layout file for entire ejs files
app.set("layout" , "layouts/layout")

app.use(bodyParser.urlencoded({extended : true}))
app.use(expressLayouts)
app.use(express.static("public"))
app.use(session({
    secret : process.env.SECRET_KEY,
    resave : false,
    saveUninitialized : true,
    store : new MongoStore({
        mongoUrl : process.env.DATABASE_URL,
        ttl : 4 * 60 * 60,
    })
}))

// using starting routing point by App
app.use("/" , indexRouter)
app.use("/topics" , topicRouter)
app.use("/about" , aboutRouter)
app.use("/materials" , materialsRouter)
app.use("/user" , userRouter)


app.use("*" , (req , res)=>{
    res.status(404).json({error : "Not Found"})
})
app.listen(9000 || process.env.PORT  , ()=>{
    console.log("Server stated at port 9000");
})