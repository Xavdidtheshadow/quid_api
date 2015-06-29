var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

module.exports = function(){
  // require things! 
  var app = express();
  app.locals.dev = process.env.NODE_ENV === undefined;
  
  var url = require('./config/db')();

  var port = process.env.PORT || 1337;

  app.use(bodyParser.urlencoded({ extended: true })); 
  app.use(bodyParser.json()); 

  // cors
  cors = require('./config/cors');
  app.use(cors);
  
  // print request
  app.use(function(req, res, next){
    if (process.env.NODE_ENV !== 'test') {
      console.log(req.method + ' - ' + req.url);
      if (req.method === 'POST') {
        console.log(req.body);
      }
    }
    // this needs to be called no matter what
    next();
  });

  // API key
  require('./config/auth')(app);

  // mongoose
  mongoose.connect(url);

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
      // mongo errors have a code, otherwise show stacktrace
      if (err.name === 'ValidationError') {
        res.status(400);
        res.json({ 
          error: Object.keys(err.errors).map(function(i) {
            return err.errors[i].message;
          })
        });
      } else {
        res.status(500);
        res.json({ error: err });
      }
    }
  );

  if (app.locals.dev) { console.log("App started on port " + port); }
  // Start the app
  return app.listen(port);
  
};