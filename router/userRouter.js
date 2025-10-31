const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db");
const router = express.Router();
const User = require("../models/user")



router.post("/register", async (request, response) => {
    try {
        const { name, username, email, password } = request.body;
        const existingUsername = await User.findOne({ username: username });

        if (existingUsername) {
            return response.status(409).json({
                message: "Username already exist",
            });
        }

        const existingEmail = await User.findOne({ email: email });

        if (existingEmail) {
            return response.status(400).json({
                message: "Email already exist"
            })
        };

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            username,
            email,
            password: hashPassword
        }

        const user = User(newUser);
        await user.save();

        response.status(200).json({ message: "User Created Successfully", user: user })
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
});

router.post("/login", async (request, response) => {
    try {
        const { username, password } = request.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return response.status(401).json({ message: "Invalid Username" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return response.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({
            userId: user._id,
            name: user.name,
            username: user.username,
            email: user.email
        }, "itm", { expiresIn: "1h" });
        response.status(200).json({message:"Login successfull",token})
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
});

router.get("/profile", async (request, response)=>{
    try {
        const {token} = request.headers;

        if (!token){
            return response.status(404).json({message:"Token is invalid"});
        }
        const decodedToken = jwt.verify(token,'itm')

        const user = await User.findById(decodedToken.userId);
        response.status(200).json(user);
    } catch (error) {
        response.status(500).send({ message: error.message }) 
    }
})

module.exports= router;