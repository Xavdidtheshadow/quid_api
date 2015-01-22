module.exports = function(app) {
  var mongoose = require('mongoose');
  var Team = mongoose.model('Team');
  var Person = mongoose.model('Person');
  var League = mongoose.model('League');
  var Game = mongoose.model('Game');

  app.get('/teams', function(req, res, next){
    Team
      .find(function(err, teams){
        if(err){return next(err);}
        res.json(teams);
      });
  });

  app.get("/people/:q", function(req, res, next) {
      var query = {};
      if (req.params.q.match(/@/)){
        query = {"email": req.params.q};
      }
      else {
        query = {"_id": req.params.q};
      }     

      Person
        .findOne(query)
        .populate('team')
        .exec(function(err, person){
          if(err){return next(err);}
          res.json(person);
        });
  });

  app.put("/people/:id/certify/:test", function(req, res, next){
    var t = {n: "certifications." + req.params.test};
    var p = Person
      .update({"_id": req.params.id}, {"$set": {t.n: true}})
      .exec(function(err, person){
        if(err){return next(err);}
        res.json(person);
      });
  });

  app.post("/people", function(req, res, next){
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