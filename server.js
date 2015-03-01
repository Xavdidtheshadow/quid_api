// require things! 
var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./config/db');

var app = express();

app.use(bodyParser.urlencoded({ extended: true })); 

// mongoose
mongoose.connect(db.url);
// register schemas
require('./models/People.js');
require('./models/Games.js');
require('./models/Leagues.js');
require('./models/Teams.js');

// routes
require('./routes/games')(app); 
require('./routes/leagues')(app); 
require('./routes/people')(app); 
require('./routes/teams')(app); 

app.get("/", function(request, response) {
    response.send("Hello world!");
});

// Start the app
app.listen(1337);
console.log("App started on port 1337.");