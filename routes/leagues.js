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

  app.get('/leagues/:id/teams', function(req, res, next){
    var id = '';

    if (req.params.id.length < 5){
      League
        .findOne({"abbreviation": req.params.id})
        .exec(function(err, league){
          if(err){return next(err);}

          id = league._id;
        });
    }
    else {
      id = req.params.id;
    }  

    // need to have this wait for first query to finish, if it's happening
    Team
      .find({"league": id})
      .exec(function(err, teams){
        if(err){return next(err);}

        res.json(teams);
      });
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