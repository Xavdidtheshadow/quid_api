// require things! 
var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./config/db');

var app = express();
var port = process.env.port || 1337;

app.use(bodyParser.urlencoded({ extended: true })); 

// mongoose
mongoose.connect(db.url);
// register schemas
require('./models/People.js');
require('./models/Games.js');
require('./models/Leagues.js');
require('./models/Teams.js');

// routes
require('./routes/people')(app); 
require('./routes/games')(app); 
require('./routes/leagues')(app); 
require('./routes/teams')(app); 

app.get("/", function(request, response) {
    response.send("This is the quidditch scheduling API.");
});

// Start the app
app.listen(port);
console.log("App started on port " + port);