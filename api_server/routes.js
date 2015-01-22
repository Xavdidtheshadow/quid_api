module.exports = function(app) {
  var mongoose = require('mongoose');
  var Team = mongoose.model('Team');
  var Person = mongoose.model('Person');
  var League = mongoose.model('League');
  var Game = mongoose.model('Game');

  app.get('/api/teams', function(req, res, next){
    Team.find(function(err, teams){
      if(err){return next(err);}
      res.json(teams);
    });
  });

  app.get("/users/:id", function(req, res, next) {
      var p = Person
        .findOne({"_id": req.params.id})
        .populate('team');

      p.exec(function(err, person){
        if(err){return next(err);}
        res.json(person);
      });
  });

  app.post("/users", function(req, res, next){
    var p = new Person(req.body);

    console.log(req.body);

    p.save(function(err, pers){
      if(err){return next(err);}
      res.json(pers);
    });
  });

  app.post("/leagues", function(req, res, next){
    var l = new League(req.body);

    // console.log(req.body);

    if (req.body.subregions){
      l.subregions = req.body.subregions.split("|");
    }

    l.save(function(err, league){
      if(err){return next(err);}
      res.json(league);
    });
  });

  app.post("/teams", function(req, res, next){
    var t = new Team(req.body);

    t.save(function(err, team){
      if(err){return next(err);}
      res.json(team);
    });
  });

  // app.get("/teams/:id", function(request, response) {
  //     response.send({status: 200, results: {name: "Michigan Quidditch", id: request.params.id}});
  // });
};