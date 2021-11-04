const mongoose = require('mongoose');

const Schema = mongoose.Schema

const newSaying = new Schema({
    firstname : String,
    lastname : String,
    message : String,
    like : [
        {id : String,}
    ],
    dislike : [
        { id : String,}
    ],
    color : String
    
}, {timestamps: true})

const NewSaying = mongoose.model('NewSaying', newSaying)
module.exports = NewSaying