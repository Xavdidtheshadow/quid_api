var mongoose = require('mongoose');

var LeagueSchema = new mongoose.Schema({
  // _id, generated by mongo

  // United States Quidditch
  name: {type: String, required: true}, 

  // ISO 3 letter country code
  code: {type: String, required: true, maxlength: 3, minlength: 3}
});

mongoose.model('League', LeagueSchema);