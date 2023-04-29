// node.js

// express app
const express = require("express");
const app = express(); // show a website to the clients

app.use( express.static("public") ); // use things inside the public folder
app.get("/", function (request, response) {      //req a html page
  response.sendFile(__dirname + "views/index.html");
});

// HTTP Server
const http = require("http");
//c






