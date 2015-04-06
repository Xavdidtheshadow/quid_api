module.exports = function(app) {
  var mongoose = require('mongoose');
  var Team = mongoose.model('Team');
  var Game = mongoose.model('Game');

  app.get('/teams', function(req, res, next){
    Team
      .find()
      // .populate('league')
      .exec(function(err, teams){
        if(err){return next(err);}

        res.json(teams);
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

  app.get('/teams/:id', function(req, res, next){
    Team
      .find({_id: req.params.id})
      .exec(function(err, team){
        if(err){return next(err);}
        if (!team){res.status(404).send('Team not found');}

        res.json(team);
      });
  });

  app.get("/teams/:id/games", function(req, res, next){
    var id = req.params.id;
    Team
      .findOne({"_id": id})
      .exec(function(err, team){
        if(err){return next(err);}
        if (!team){res.status(404).send('Team not found');}

        Game
          .find({$or: [
            {team_a: id}, 
            {team_b: id},  
            {staff: id}]})
          .populate('team_a team_b head_referee snitch')
          .exec(function(err, games){
            if(err){return next(err);}

            res.json({games: games, team: team});
          });
      });

  });

    
};