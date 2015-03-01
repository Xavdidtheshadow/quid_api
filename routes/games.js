module.exports = function(app) {
  var mongoose = require('mongoose');
  var Game = mongoose.model('Game');

  app.get("/games", function(req, res, next){
    Game
      .find()
      .populate("team_a team_b head_referee snitch", 'name certifications')
      .exec(function(err, games){
        if(err){return next(err);}

        res.json(games);
      });
  });

  app.post("/games", function(req, res, next){
    var g = new Game(req.body);

    console.log(req.body);

    g.save(function(err, game){
      if(err){return next(err);}

      res.json({status: 201, message: game._id});
    });
  });
};