module.exports = function(app) {
  var mongoose = require('mongoose');
  // var Team = mongoose.model('Team');
  var Person = mongoose.model('Person');

  app.get('/api/teams', function(req, res, next){
    Team.find(function(err, teams){
      if(err){return next(err);}
      res.json(teams);
    });
  });

  app.get("/users/:id", function(request, response) {
      
  });

  app.post("/users", function(req, res){
    var p = new Person(req.body);

    console.log(req.body);

    p.save(function(err, pers, next){
      if(err){return next(err);}
      res.json(pers);
    });
  });

  app.get("/teams/:id", function(request, response) {
      response.send({status: 200, results: {name: "Michigan Quidditch", id: request.params.id}});
  });
};