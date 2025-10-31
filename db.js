const mongoose = require("mongoose");

mongoose.connect(process.env.mongodb_URI)

const db=mongoose.connection;

db.on("connected",()=>{
    console.log("Databse connected successfully")
})

db.on("disconnect",()=>{
    console.log("Databse disconnected")
})

db.on("error",(err)=>{
    console.log("Database connection error",err);
});

module.exports=db;