


const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/myinotebook";

//"mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=falsec";


const connectToMongo = () => {
    mongoose.connect(mongoURI,()=>{
        console.log('mongoose is activated');
    })
}

module.exports = connectToMongo;


// const express = require("express");
// const app = express();

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

