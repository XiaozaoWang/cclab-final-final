// node.js

// express app
const express = require("express"); // require some package from the library
const app = express(); // show a website to the clients
let clients = [];
let client_count = 0;

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
  client_count += 1;
  sck.name = client_count;
  sck.idCard = [sck.name, sck.id];
  clients.push(sck.idCard);
  sck.write(`Welcome, ${sck.name}!\n`);
  console.log("clients:",clients);

  
  
  
  
  
  sck.on("clientOutPos", receive); // sets up a listener for a custom event called "clientOutPos"
  function receive(data) {   // what you receive is "data"
    //https://socket.io/docs/v3/emit-cheatsheet/index.html
    console.log(data);
    sck.broadcast.emit("serverOutPos", data); // send to all except for the sender
  }
}










