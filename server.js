// require things! 
var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./config/db');

var app = express();

app.use(bodyParser.urlencoded({ extended: true })); 

mongoose.connect(db.url);
require('./models/People.js');
require('./models/Games.js');
require('./models/Leagues.js');
require('./models/Teams.js');



require('./routes')(app); 

// Routes
app.get("/", function(request, response) {
    response.send("Hello world!");
});

// Start the app
app.listen(1337);
console.log("App started on port 1337.");