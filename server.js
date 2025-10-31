require('dotenv').config();
const express = require("express");
const userRouter = require("./router/userRouter");
const hotelsrouter = require("./router/hotelsrouter");

const db = require("./db");

const requestLogger = (request,response,next)=>{
    console.log(`${request.method} : ${request.url}`);
    next();
}

const app = express();
app.use(express.json());
app.use(requestLogger);

app.use('/user',userRouter);
app.use('/hotels',hotelsrouter);

app.get("/",(request,response)=>{
    response.send("Welcome to Hotels API")
});

app.listen(10000,()=>{
    console.log("Server started on port 3000"); 
});

// simple health check used by hosting providers
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
