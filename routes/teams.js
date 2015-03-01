module.exports = function(app) {
  var mongoose = require('mongoose');
  var Team = mongoose.model('Team');

  app.get('/teams', function(req, res, next){
    Team
      .find()
      .populate('league')
      .exec(function(err, teams){
        if(err){return next(err);}

        res.json(teams);
      });
  });

  app.post("/teams", function(req, res, next){
    var t = new Team(req.body);

    t.save(function(err, team){
      if(err){return next(err);}

      res.json({status: 201, message: team._id});
    });
  });

    
};