require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to Mongo DB");

    })
    .catch((err) => {
        console.error("Error connecting to Mongo DB: ", err.message);
    });