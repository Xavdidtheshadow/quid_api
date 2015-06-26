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
        if (!person){return res.status(404).send('Person not found');}

        res.json(person);
      });
  });

  app.post("/people", function(req, res, next){
    var p = new Person(req.body);

    p.save(function(err, pers){
      if(err){return next(err);}

      res.json({status: 201, message: pers._id});
    });
  });

};