module.exports = function(app) {
  var mongoose = require('mongoose');
  var Person = mongoose.model('Person');
  var Game = mongoose.model('Game');
  var Team = mongoose.model('Team');

  app.get("/people", function(req, res, next){
    var opts = {
      path: 'teams.league',
      model: 'League',
      select: 'name code'
    };

    Person
      .find()
      .populate('teams')
      .exec(function(err, people){
        if(err){return next(err);}
        
        // nested populate for league info
        Team.populate(people, opts, function(err, people){
          if(err){return next(err);}
          res.json(people);
        });
      });
  });

  app.get("/people/:id", function(req, res, next) {
    Person
      .findOne({"_id": req.params.id})
      .populate('teams')
      .exec(function(err, person){
        if(err){return next(err);}
        res.json(person);
      });
  });

  // make a new person
  // if only it wasn't mutually exclusive with programming
  app.post("/people", function(req, res, next){
    new Person(req.body).save(function(err, person){
      if(err){return next(err);}
      res.status(201).json(person);
    });
  });

};