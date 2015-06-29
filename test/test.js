// let's test stuff
// eventually this should always test on a test DB
// var url = require('../config/db');
var mongoose = require('mongoose');
var request = require('supertest');
var assert = require('assert');
var rand_id = require('../config/id.js');

// starts the server
var server = require('../server');

describe('Routes', function(){
  // this is accessible all through this function
  // TODO: update for test server
  var ids = {
    league: '5589092f534716a974c3789f',
    team: '558a5b252fda6b44c0279bc6',
    game: '558b938ff48494b8eeb3293f',
    person: '558a61e7f3398ac2db91c04f'
  };
  var app;
  before(function() {
    // In our tests we use the test db
    app = server();
  });

  after(function(){
    app.close();
  });

  // could have issues with tests if the port on travis changes
  var url = 'http://localhost:1337';

  describe('Games', function(){
    it('should get all games', function(done){
      request(url)
        .get('/games')
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body.length > 0);

          done();
        });
    });

    it('should get a game', function(done){
      request(url)
        .get('/games/' + ids.game)
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body._id !== undefined);

          done();
        });
    });

    it('should create a new game', function(done){
      var g = {teams: [ids.team, ids.team]};
      request(url)
        .post('/games?api_key=' + process.env.API_KEY)
        .send(g)
        .expect(201)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body._id !== undefined);
          done();
        });
    });

    it('should validate a game', function(done){
      // this is basically everything that can go wrong with a game
      var g = {
        scores: [6, 12], 
        teams: [ids.team, ids.team, ids.team], 
        snitch_snatches: [ids.team, ids.team, ids.team, ids.team], 
        overtimes: 3
      };
      request(url)
        .post('/games?api_key=' + process.env.API_KEY)
        .send(g)
        .expect(400)
        .end(function(err, res){
          if (err) { throw err; }
          var j = JSON.parse(res.error.text);
          assert(j.error.length > 3);
          done();
        });
    });


  });

  describe('Leagues', function(){
    it('should get all leagues', function(done){
      request(url)
        .get('/leagues')
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body.length > 0);

          done();
        });
    });

    it('should get a league', function(done){
      request(url)
        .get('/leagues/' + ids.league)
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body._id !== undefined);

          done();
        });
    });

    it('should not get a bogus league', function(done){
      request(url)
        .get('/leagues/badid')
        .expect(500, done);
    });

    it('should get teams for a league', function(done){
      request(url)
        .get('/leagues/' + ids.league + '/teams')
        .expect(200)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body.teams.length > 0);

          done();
        });
    });

    it('should create a new league', function(done){
      var l = {name: 'Test League', code: rand_id()};
      request(url)
        .post('/leagues?api_key=' + process.env.API_KEY)
        .send(l)
        .expect(201)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body._id !== undefined);
          done();
        });
    });

    it('should validate leagues', function(done){
      var l = {name: 'Test League', code: 'BadID'};
      request(url)
        .post('/leagues?api_key=' + process.env.API_KEY)
        .send(l)
        .expect(400, done);
    });
  });

});