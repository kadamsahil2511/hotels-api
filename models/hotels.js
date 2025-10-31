const mongoose = require('mongoose');

const hotelsSchema = {
    // id no., name, location,rating, cost pernight
    id:{
        type:Number,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    location:{
        type: String,
        require:true,
    },
    rating:{
        type:Number,
        require:true
    },
    pricePerNight:{
        type:Number,
        require:true
    }
}

const hotels=new mongoose.model("hotels",hotelsSchema);

module.exports=hotels;