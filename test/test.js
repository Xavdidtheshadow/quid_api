// let's test stuff
// eventually this should always test on a test DB
var url = require('../config/db')(process.env.NODE_ENV !== 'production');
var mongoose = require('mongoose');
var request = require('supertest');
var assert = require('assert');
var rand_id = require('../config/id.js');

// starts the server
var server = require('../server');

describe('Routes', function(){
  // this is accessible all through this function
  var ids = {
    league: '5589092f534716a974c3789f',
    team: '558a5b252fda6b44c0279bc6',
    game: '',
    person: ''
  };
  var app;
  before(function() {
    // In our tests we use the test db
    app = server();
  });

  after(function(){
    app.close();
  });

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

    it('should create a new game', function(done){
      var g = {name: 'Test League', code: rand_id()};
      request(url)
        .post('/leagues?api_key=' + process.env.API_KEY)
        .send(g)
        .expect(201)
        .end(function(err, res){
          if (err) { throw err; }

          assert(res.body._id !== undefined);
          done();
        });
    });

    // it('should validate a game with bad scores', function(done){

    // });


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

    it('should fail a long league code', function(done){
      var l = {name: 'Test League', code: 'BadID'};
      request(url)
        .post('/leagues?api_key=' + process.env.API_KEY)
        .send(l)
        .expect(400, done);
    });
  });

});