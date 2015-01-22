// require things! 
var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./config/db');

var app = express();

// these were needed so that form-encoded json was recognized. but only one line, apparently
// app.use(bodyParser.json()); 
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyParser.urlencoded({ extended: true })); 

mongoose.connect(db.url);
require('./models/Persons.js');



require('./routes')(app); 

// Routes
app.get("/", function(request, response) {
    response.send("Hello world!");
});

// Start the app
app.listen(1337);
console.log("App started on port 1337.");