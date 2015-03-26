// require things! 
var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./config/db');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true })); 

// cors
cors = require('./config/cors');
app.use(cors);

// API key
require('./config/auth')(app);

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
    response.send({
      status: 200, 
      info: "https://github.com/quidtech/quid_api",
      routes: [
        '/games',
        '/people',
        '/teams',
      ]
    });
});

// Start the app
app.listen(port);
console.log("App started on port " + port);