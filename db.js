const mongoose = require("mongoose");

mongoose.connect("mongodb://root:zHKyEdzQniczfWa5rRm4OqSIUVWfu1ZhhpcHQcrDzY3HIJfjVmTj1zD6evk0MF9d@93.127.166.196:5432/?directConnection=true")

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