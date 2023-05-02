// node.js

// express app
const express = require("express"); // require some package from the library
const app = express(); // show a website to the clients

app.use(express.static("public")); // use things inside the public folder
app.get("/", function (request, response) {  // "/" is the root URL
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
  
  
  
  
  socket.write('Please enter your name: ');
  // Store the name when the client sends it
  socket.on('data', function(data) {
  const name = data.toString().trim();
  console.log(`Client name is ${name}`);

  // Store the name on the socket object for future use
  socket.name = name;

  // Send a welcome message to the client
  socket.write(`Welcome, ${name}!\n`);
  
  
  
  
  
  sck.on("clientOutPos", receive); // sets up a listener for a custom event called "connection_name" 
  function receive(data) {   // what you receive is "data"
    //https://socket.io/docs/v3/emit-cheatsheet/index.html
    console.log(data);
    sck.broadcast.emit("serverOutPos", data); // send to all except for the sender
  }
}










