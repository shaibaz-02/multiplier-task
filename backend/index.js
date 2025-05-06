const express=require('express')
const app=express()
const path=require('path')
const mongoose=require('mongoose')
const cookiePaser = require("cookie-parser");
const User = require("./models/user");
const userRoute = require("./routes/user");

const {
    checkForAuthenticationCookie,
  } = require("./middlewares/authentication");
  
mongoose
  .connect('mongodb://127.0.0.1:27017/multiplier')
  .then((e) => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));


app.use("/user", userRoute);
app.get('/',(req,res)=>{
    res.render('home',{
        user: req.user,
    });
})

app.listen(8000,()=>{
    console.log("listening on the port 8000");
})