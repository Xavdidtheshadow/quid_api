module.exports = function(app) {
  var mongoose = require('mongoose');
  var Game = mongoose.model('Game');
  var Person = mongoose.model('Person');
  var extend = require('util')._extend;

  app.get("/games", function(req, res, next){
    var query = {};

    // query params
    if (req.query.pitch) {extend(query, {pitch: req.query.pitch});}
    if (req.query.after) {extend(query, {timeslot: {$gt: req.query.after}});}

    Game
      .find(query)
      // this works because mongoose just ignores fields it can't populate
      .populate("team_a team_b head_referee snitch staff")
      .exec(function(err, games){
        if(err){return next(err);}
        var g = games.sort(function(a, b){
          if (a.timeslot === b.timeslot){
            return a.pitch - b.pitch;
          }
          else {
            return a.timeslot - b.timeslot;
          }
        });
        res.json(g);
      });
  });

  app.get('/games/:id', function(req, res, next){
    Game
      .findOne({_id: req.params.id})
      .populate("team_a team_b head_referee snitch staff")
      .exec(function(err, game){
        if(err){return next(err);}
        if (!game){res.status(404).send('Game not found');}

        if(req.query.crews) {
          Person
            .find({crews: {$in: game.crews}})
            .exec(function(err, refs){
              if(err){return next(err);}
              res.json({game: game, refs: refs});
            });
        }
        else {
          res.json(game);
        }
      });
  });

  app.post("/games", function(req, res, next){
    var g = new Game(req.body);

    g.save(function(err, game){
      if(err){return next(err);}

      res.json({status: 201, message: game._id});
    });
  });

  app.post("/games/hr", function(req, res, next){
    var g = req.body;
    console.log(g);
    Game
      .findOne({_id: g.id})
      .exec(function(err, game){
        if(err){return next(err);}
        game.head_referee = g.hr;
        game.save(function(err, game){
          if(err){return next(err);}

          res.json({status: 202, message: game._id});
        });
      });
  });

  app.post("/games/snitch", function(req, res, next){
    var g = req.body;
    Game
      .findOne({_id: g.id})
      .exec(function(err, game){
        if(err){return next(err);}
        game.snitch = g.snitch;
        game.save(function(err, game){
          if(err){return next(err);}

          res.json({status: 202, message: game._id});
        });
      });
  });
};