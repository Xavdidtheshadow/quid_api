module.exports = function(app) {
  var mongoose = require('mongoose');
  var Person = mongoose.model('Person');
  var Game = mongoose.model('Game');

  app.get("/people", function(req, res, next){
    Person
      .find()
      .populate('team requests')
      .exec(function(err, people){
        if(err){return next(err);}
        // don't care about league right now
        // var opts = {
        //   path: 'team.league',
        //   model: 'League',
        //   select: 'name abbreviation'
        // };
        // // nested populate
        // Person.populate(people, opts, function(err, people){
        //   if(err){return next(err);}

        res.json(people);
        // });
      });
  });

  app.get("/people/head_referees", function(req, res, next){
    Person
      .find({"certifications.hr": true})
      .populate('team')
      .exec(function(err, people){
        if(err){return next(err);}

          res.json(people);
        });
  });

  app.get("/people/:id/games", function(req, res, next){
    Person
      .findOne({"_id": req.params.id})
      .populate('team')
      .exec(function(err, person){
        if(err){return next(err);}
        if (!person){res.status(404).send('Person not found');}
        Game
          .find({$or: [
            {head_referee: person._id},
            {snitch: person._id},
            {team_a: person.team._id},
            {team_b: person.team._id},
            {crews: {$in: person.crews}}
          ]})
          .populate('team_a team_b head_referee snitch')
          .exec(function(err, games){
            if(err){return next(err);}

            res.json({games: games, ref: person});
          });
      });
  });

  app.get("/people/:q", function(req, res, next) {
    var query = {};
    if (req.params.q.match(/@/)){
      query = {"email": req.params.q};
    }
    else if (req.params.q.match(/ /)){
      query = {"name": req.params.q};
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
    // multiple steps to use a variable as an object key
    var to_update = {};
    to_update["certifications." + req.params.test] = true;

    Person
      .update({"_id": req.params.id}, to_update)
      .exec(function(err, person){
        if(err){return next(err);}

        if(person.length > 0) {
          res.json({status: 200, message: 'ok'});
        }
        else {
          res.status(404).send('Person not found');
        }
      });
  });

  app.post("/people", function(req, res, next){
    var p = new Person(req.body);

    // console.log(req.body);

    p.save(function(err, pers){
      if(err){return next(err);}

      res.json({status: 201, message: pers._id});
    });
  });

  app.get('/crews', function(req, res, next){
    Person
      .distinct('crews')
      .exec(function(err, crews){
        if(err){return next(err);}
        res.json(crews.sort());
      });

  });

  app.get('/crews/:id', function(req, res, next){
    // only words for 3 character crews
    var raw = req.params.id.toUpperCase();
    var id = raw.slice(0,2) + raw[2].toLowerCase();
    Person
      .find({crews: id})
      .populate('team')
      .exec(function(err, crew){
        if(err){return next(err);}
        if (!crew){res.status(404).send('Crew not found');}

        res.json({crew: id, people: crew});
      });
  });

  app.get('/crews/:id/games', function(req, res, next){
    // only words for 3 character crews
    var raw = req.params.id.toUpperCase();
    var id = raw.slice(0,2) + raw[2].toLowerCase();
    var query = id;
    if (id[2] === 'a') {
      console.log('npr');
      id = ['A'+id.slice(1,3), 'B'+id.slice(1,3)]; 
      query = {$in: id};
    }
    Game
      .find({crews: query})
      .populate("team_a team_b head_referee snitch")
      .exec(function(err, games){
        if(err){return next(err);}
        if (!games){res.status(404).send('Crew not found');}

        res.json({crew: id, games: games});
      });
  });
};