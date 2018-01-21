var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

/*Router*/
var user = require('./routes/user');
//var upload = require('./routes/upload');

var motel = require('./routes/motel');
//var uploadImg = require('./server/routes/uploadImg');
var vote = require('./routes/vote');
var comment = require('./routes/comment.js');


var config = require('./config/index');
/*Connect to DB */ 
mongoose.Promise = global.Promise;

mongoose.connect( config.getDbConnectionString())
    .then(() => console.log('connection successfull'))
    .catch((err) => console.log(err));

var app = express();



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/assets', express.static(__dirname + "/uploads"));

/*Router use */

app.use('/users', user);
//app.use('/upload',upload);

app.use('/motel', motel);
//app.use('/uploadImg',uploadImg);
app.use('/vote', vote);
app.use('/comment', comment);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;