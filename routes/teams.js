module.exports = function(app) {
  var mongoose = require('mongoose');
  var Team = mongoose.model('Team');
  var Game = mongoose.model('Game');
  var Person = mongoose.model('Person');
  
  app.get('/teams', function(req, res, next){
    Team
      .find()
      .populate('league')
      .exec(function(err, teams){
        if(err){return next(err);}

        res.json(teams);
      });
  });

  app.get('/teams/:id', function(req, res, next){
    Team
      .findOne({_id: req.params.id})
      .exec(function(err, team){
        if(err){return next(err);}
        if (!team){return res.status(404).send('Team not found');}

        res.json(team);
      });
  });

  app.get('/teams/:id/games', function(req, res, next){
    Game
      .find({teams: req.params.id})
      .populate('teams head_referee snitch snitch_snatches')
      .exec(function(err, games){
        if(err){return next(err);}

        res.json({games: games, team: team});
      });
  });

  app.get('/teams/:id/people', function(req, res, next){
    Person
      .find({"teams.0": req.params.id})
      .exec(function(err, people){
        if(err){return next(err);}

        res.json({people: people, team: team});
      });
  });

  app.post('/teams', function(req, res, next){
    try {
      var t = new Team(req.body);

      t.save(function(err, team){
        if(err){return next(err);}

        res.json({status: 201, message: team._id});
      });
    } catch (e) {
      return next(e);
    }
  });    
};