var mongoose = require("mongoose");

var Schema = mongoose.Schema; 


var commentSchema = new Schema({
   
    customer_id: String,
    motel_id: String,
    customer_name: String,
    content: String,
    add_date: Date


},{collection : 'comments'});

var comments  = mongoose.model("comments", commentSchema);

module.exports = comments;