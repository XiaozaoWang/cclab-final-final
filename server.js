// node.js

// express app
const express = require("express");
const app = express(); // show a website to the clients

app.use(express.static("public")); // use things inside the public folder
app.get("/", function (request, response) {
  //req a html page
  response.sendFile(__dirname + "/views/index.html"); // grab a special one
});

// HTTP Server
const http = require("http");
//const hostname = "127.0.0.1"; // localhost
const port = 3000;
const server = http.createServer(app);
//server.listen(port, hostname, function() {});
server.listen(port, function () {
  console.log("Server is running: Port: " + port);
});