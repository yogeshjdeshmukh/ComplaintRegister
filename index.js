var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/Nimbus');
var db = mongoose.connection;

app.use(bodyParser.urlencoded({ extended: true }))


app.use(bodyParser.json());
app.use('/', require('./routes/api'));
app.use(express.static(__dirname + '/views'));


//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});



app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
  });
  
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });


 var server = app.listen(3000, function () {
    console.log('Express app listening on port 3000');
  });