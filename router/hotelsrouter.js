// importing express and bcrypt and passport
const express = require('express'); 
const bcrypt = require('bcryptjs');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// creating instance with name app
const app = express();
app.use(express.json());

const requestLogger = (request, response, next)=>{
    console.log(`${request.method} ${request.path} - ${new Date().toISOString()}`);
    next();
}

app.use(requestLogger);

passport.use(new LocalStrategy((username,password,done)=>{
    const user = users.find((user)=>user.username===username);
    if(!user){
        return done(null,false,{message : "Incorrect username."});
    }

    const isMatch=bcrypt.compare(password, user.password);
    if(!isMatch){
        return done(null,false,{message : "Incorrect password."});
    }

    return done(null,user);
}))

app.use(passport.initialize());

const isAuthenticated = passport.authenticate('local', {session:false});

const hotels = require("../models/hotels");
const router = express.Router();

router.get("/:id",async (request,response)=>{
    try {
        const hotel = await hotels.findById(request.params.id);
        if(!hotel){
            return response.status(404).send({message:"hotel not found"});
        } else {
            response.status(200).send(hotel);
        }
    } catch (error) {
        response.status(500).send({message:error.message})      
    }
})

router.get("/", async (request, response) => {
    try {
        const hotelsList = await hotels.find();
        response.status(200).json(hotelsList);
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
});

router.post("/", async (request, response) => {
    try {
        const {name,id,location,rating,pricePerNight}=request.body;
        const newHotelDetails ={
            name,
            id,
            location,
            rating,
            pricePerNight
        };
        const newHotel = new hotels(newHotelDetails);
        await newHotel.save();
        response.status(201).send(newHotel);
    } catch (error) {
        response.status(500).send({message:error.message})
    }
});


router.put("/:id", async (request, response) => {
    try {
        const updatedHotel = await hotels.findByIdAndUpdate(request.params.id,request.body,{new:true});
        if(!updatedHotel){
            return response.status(404).send({message:"hotel not found"});
        } else {
            response.status(200).json({message:"hotel updated sucessfully", hotel: updatedHotel});
        }
    } catch (error) {
        response.status(500).send({message:error.message}) 
    }
});

router.delete("/:id", async (request, response) => {
    try {
        const deletedHotel = await hotels.findByIdAndDelete(request.params.id);
        if (!deletedHotel) {
            return response.status(404).send({ message: "hotel not found" });
        } else {
            response.status(200).json({message:"hotel deleted successfully", hotel: deletedHotel});
        }
    } catch (error) {
        response.status(500).send({message:error.message});
    }
});

module.exports = router;