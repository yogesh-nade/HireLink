const mongoose =require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/OOT"); 

// To load view 
const express=require("express");
const app=express();
const bodyParser = require('body-parser');

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public"));
//calling  route  file
const userRoute =require("./routes/userRouts");
app.use('/',userRoute)


const adminRoute =require("./routes/adminRouts");
app.use('/admin',adminRoute)

const hostname='0.0.0.0';
app.listen(3000,hostname,function(){
    console.log("Server is Running .. at port 3000");
})