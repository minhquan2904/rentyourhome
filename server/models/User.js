var mongoose = require("mongoose");

var Schema = mongoose.Schema; 

var userSchema = new Schema({
    username: {type: String, required: true},
    hash: {type: String, required: true},
    firstname: String,
    lastname: String, 
    phone: Number,
    role: Number
},{collection : 'users'});

var users  = mongoose.model("users", userSchema);

module.exports = users;
