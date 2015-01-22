// require things! 
var express = require("express");
var url = require('url');

var app = express();

// Routes
app.get("/", function(request, response) {
    response.send("Hello world!");
});

// app.get("/users", function(request, response) {
//     response.send("Users Query!");
// });

// could take comma separated lists to fetch multiple objects

app.get("/users/:id", function(request, response) {
    response.send({status: 200, results: {name: "David Brownman", team: request.params.id}});
});

app.get("/teams/:id", function(request, response) {
    response.send({status: 200, results: {name: "Michigan Quidditch", id: request.params.id}});
});

// Start the app
app.listen(1337);
console.log("App started on port 1337.");