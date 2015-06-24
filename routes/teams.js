module.exports = function(app) {
  var mongoose = require('mongoose');
  var Team = mongoose.model('Team');
  var Game = mongoose.model('Game');
  var Person = mongoose.model('Person');

  function getQuery(id) {
    if (id.length <= 4) {
      return {short_name: id.toUpperCase()};
    }
    else {
      return {_id: id};
    }
  }

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
      .findOne(getQuery(id))
      .exec(function(err, team){
        if(err){return next(err);}
        if (!team){return res.status(404).send('Team not found');}

        res.json(team);
      });
  });

  app.get('/teams/:id/games', function(req, res, next){
    var id = req.params.id;
    Team
      .findOne(getQuery(id))
      .exec(function(err, team){
        if(err){return next(err);}
        if (!team){return res.status(404).send('Team not found');}

        Game
          .find({teams: team._id})
          .populate('teams head_referee snitch snitch_snatches')
          .exec(function(err, games){
            if(err){return next(err);}

            res.json({games: games, team: team});
          });
      });
  });

  app.get('/teams/:id/people', function(req, res, next){
    var id = req.params.id;
    Team
      .findOne(getQuery(id))
      .exec(function(err, team){
        if(err){return next(err);}
        if (!team){ return res.status(404).send('Team not found');}

        Person
          .find({"teams.0": team._id})
          .exec(function(err, people){
            if(err){return next(err);}

            res.json({people: people, team: team});
          });
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