module.exports = function(app) {
  var mongoose = require('mongoose');
  var League = mongoose.model('League');
  var Team = mongoose.model('Team');

  app.get('/leagues', function(req, res, next){
    League
      .find(function(err, teams){
        if(err){ return next(err); }
        res.json(teams);
      });
  });

  app.get('/leagues/:id', function(req, res, next){
    League
      .findOne({_id: req.params.id})
      .exec(function(err, league){
        if(err){ return next(err); }
        res.json(league);
      });
  });

  app.get('/leagues/:id/teams', function(req, res, next){
    Team
      .find({league: req.params.id})
      .exec(function(err, teams){
        if(err){ return next(err); }
        res.json({teams: teams, league: req.params.id});
      });
  });  

  // create a league
  app.post("/leagues", function(req, res, next){
    new League(req.body).save(function(err, league){
      if(err){ return next(err); }
      res.status(201).json(league);
    });
  });
};