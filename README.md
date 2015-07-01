# quid_api 

[![Travis](https://img.shields.io/travis/quidtech/quid_api.svg)](https://travis-ci.org/quidtech/quid_api)
[![David](https://img.shields.io/david/quidtech/quid_api.svg)](https://david-dm.org/quidtech/quid_api)
[![GitHub release](https://img.shields.io/github/release/quidtech/quid_api.svg)]()

The definitive api for accessing quidditch player and team information.

## Schema

We're currently using the finalized version of the 1.0 schema. You can find those in detail in [/models](https://github.com/quidtech/quid_api/tree/master/models). 

In general, the schema was designed as a very lightweight, league-agnostic way to track people and teams across seasons and leagues. Our goal was to collect the minimum amount of information needed to verify uniqueness of a person, team, or game. 

## Routes
We currently maintain the following `GET` routes. Let us know if there are others you'd like to see!

### Games
* `/games` - get all games
* `/games/:id` - get info on a single game

### Leagues
* `/leagues` - get all leagues
* `/leagues/:id` - get info on a single league
* `/leagues/:id/teams` - get all teams for a league, unsorted

### People
* `/people` - get all people
* `/people/:id` - get info on a single person

### Teams
* `/teams` - get all teams
* `/teams/:id` - get info on a single team
* `/teams/:id/people` - get all people associated with a team
* `/teams/:id/games` - get all games a team played in

## Writing to the database

If you'd like an API key so you and your league can write to the database, contact [David](mailto:beamneocube@gmail.com?subject=quid_api%20key%20request) for more info.

### Quirks

Everything should make sense, but just in case it doesn't, here are some common pitfalls.

* If you're leaving a field blank (which is fine for any non-required field), just don't submit it at all with your POST request. For example:


```javascript
// bad
{
    first_name: "Bruce",
    last_name: "Wayne",
    email: null
}

// good
{
    first_name: "Bruce",
    last_name: "Wayne"
}
```

* Dates are parsed with javascript's [`Date.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) function. It's really good about what it accepts, but definitely test if you're not sure if you're submitting dates correctly. 

That's all for now! Will update more as they come.

## Development

### Running the server

1. Install dependencies (`npm install`).
2. Seed a local mongo database by running `npm seed`.
3. Run `foreman start -f Procfile.dev`, which will run mongo and the server. 
4. Go to `http://localhost:1337` to see your server in action!

### Testing

After steps 1 & 2 above, do the following: 

1. In a terminal window, run `mongod`.
2. In another, run [`mocha`](http://mochajs.org/).

### Contributing

If you have a suggestion for a schema update, a new route, or any other improvement, don't hesitate to [contact us](mailto:beamneocube@gmail.com), open an issue or create a pull request!
