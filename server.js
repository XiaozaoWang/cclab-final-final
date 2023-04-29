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

// socket.io
const socket = require("socket.io"); // library (package)
const io = socket(server); //connect socket with server

io.on("connection", newConnection);
function newConnection(sck) {
  console.log("New Connection - ID: " + sck.id);
  // sck.on()
  sck.on("connection_name", receive);
  function receive(data) {
    //https://socket.io/docs/v3/emit-cheatsheet/index.html
    console.log(data);
    sck.broadcast.emit("connection_name", data); // send to all except for the sender
  }
}










