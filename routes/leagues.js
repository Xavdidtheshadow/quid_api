module.exports = function(app) {
  var mongoose = require('mongoose');
  var League = mongoose.model('League');
  var Team = mongoose.model('Team');

  app.get('/leagues', function(req, res, next){
    League
      .find(function(err, teams){
        if(err){return next(err);}

        res.json(teams);
      });
  });

  app.get('/league/:id/teams', function(req, res, next){
    // can I nest stuff like this?
    // there might be a way to sync this better, but maybe not
    function findTeam(league_id) {
      Team
        .find({"league": league_id})
        .exec(function(err, teams){
          if(err){return next(err);}

          res.json(teams);
        });
    }

    var league_id = '';
    if (req.params.id.length === 3){
      League
        .findOne({"code": req.params.id.toUpperCase()})
        .exec(function(err, league){
          if(err){return next(err);}
          findTeam(league._id);
        });
    }
    else {
      findTeam(req.params.id);
    }  
  });

  app.post("/leagues", function(req, res, next){
    console.log("top of the request");
    console.log(req.body);
    var l = new League(req.body);

    // if (req.body.subregions){
    //   l.subregions = req.body.subregions.split("|");
    // }

    l.save(function(err, league){
      if(err){console.log(err); console.log("AHHH");return next(err);}

      res.json({status: 201, message: league._id});
    });
  });


};