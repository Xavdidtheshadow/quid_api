// require things! 
var express = require("express");
var url = require('url');

var app = express();

// Routes
app.get("/", function(request, response) {
    response.send("Hello world!");
});

app.get("/users", function(request, response) {
    response.send("Users Query!");
});

app.get("/users/:id", function(request, response) {
    response.send({status: 200, query: request.params.id});
});

// Start the app
app.listen(1337);
console.log("App started on port 1337.");