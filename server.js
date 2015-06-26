// require things! 
var express = require("express");
var app = express();
app.locals.dev = process.env.NODE_ENV !== 'production';

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./config/db');

var port = process.env.PORT || 1337;

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

// cors
cors = require('./config/cors');
app.use(cors);
// print request
app.use(function(req, res, next){
  if (app.locals.dev) {
    console.log(req.method + ' - ' + req.url);
    if (req.method === 'POST') {
      console.log(req.body);
    }
    next();
  }
});

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
    response.json({
      info: "https://github.com/quidtech/quid_api",
      basic_routes: [
        '/games',
        '/people',
        '/teams',
        '/leagues'
      ]
    });
});

// catch-all error handling
app.use(function (err, req, res, next) {
    res.status(500);
    // mongo errors have a code, otherwise show stacktrace
    if (err.code) {
      res.json({ error: err });
    } else {
      res.json({ error: err.stack });
    }
  }
);

// Start the app
app.listen(port);
console.log("App started on port " + port);