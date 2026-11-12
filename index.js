require('dotenv').config();
const cookieParser = require("cookie-parser")
const express = require("express")
const { dbConnects } = require("./connection")
const userAuthRoutes = require("./routes/users")
const notesRoutes = require("./routes/notes")
// const bcrypt=require("bcrypt")
// const jwt= require("jsonwebtoken")
const app = express()

// set the view engine to ejs
app.set('view engine', 'ejs');

app.set("views", "./views");

// use res.render to load up an ejs view file

// // index page
// app.get('/', (req, res) => {
//   res.redirect('/login');
// });

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

dbConnects(process.env.MONGODBURL)


app.use(cookieParser())

// cookies
// app.get("/" ,function (req,res){
//     res.cookie("name","karishma")
//     res.send("done")

// })

// app.get("/read" ,function (req,res){
//     console.log(req.cookies)
//     res.send("read page")

// })


//bcrypt
// app.get("/" ,function (req,res){
// bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash("Karishma321@", salt, function(err, hash) {
//         // Store hash in your password DB.
//         console.log(hash)
//     });
// });

// })



//jwt

// app.get("/" ,function (req,res){
//   const token=jwt.sign({email:"karishma321@"}, "secrate")
//  console.log(token)
// res.cookie("token",token)
// res.send("done")
// })

// app.get("/read", function(req,res){
//     console.log(req.cookies.token)
//     const data =jwt.verify(req.cookies.token ,"secrate")
//     res.send("done read")
//      console.log(data)

// })

app.use("/", notesRoutes)
app.use("/", userAuthRoutes)


// console.log(Math.floor(Math.random() * 10));


app.listen(process.env.PORT, () => console.log(`server is runing port 8000`))