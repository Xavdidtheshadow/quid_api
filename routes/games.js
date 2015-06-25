module.exports = function(app) {
  var mongoose = require('mongoose');
  var Game = mongoose.model('Game');
  var Person = mongoose.model('Person');
  var extend = require('util')._extend;

  app.get('/games', function(req, res, next){
    Game
      .find()
      .populate('teams head_referee snitch')
      .exec(function(err, games){
        if(err){return next(err);}
        res.json(games);
      });
  });

  app.get('/games/:id', function(req, res, next){
    Game
      .findOne({_id: req.params.id})
      .populate("teams head_referee snitch")
      .exec(function(err, game){
        if(err){return next(err);}
          res.json(game);
      });
  });

  // create a new game
  app.post('/games', function(req, res, next){
    new Game(req.body).save(function(err, game){
      if(err){return next(err);}

      res.status(201).json(game);
    });
  });

  // update a game
  app.put('/games/:id', function(req, res, next){
    Game
      .findById(req.params.id)
      .exec(function(err, game){
        if(err){return next(err);}

        extend(game, req.body);

        game.save(function(err, game){
          if(err){return next(err);}
          res.status(200).json(game);
        });
      });
  });
};