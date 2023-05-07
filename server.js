// node.js

// express app
const express = require("express"); // require some package from the library
const app = express(); // show a website to the clients

let clients = {};
let client_count = 0;

app.use(express.static("public"));
app.use(express.static("views"));// use things inside the public folder
app.get("/", function (request, response) {  // "/" is the root URL
  //req a html page
  response.sendFile(__dirname + "/views/index.html"); // grab a special one (actually starts with it)
});

// HTTP Server
const http = require("http");
//const hostname = "127.0.0.1"; // localhost
const port = 3000;
const server = http.createServer(app); // "server" is an HTTP server object we create here
//server.listen(port, hostname, function() {});
server.listen(port, function () {
  console.log("Server is running: Port: " + port);
});

// socket.io
const socket = require("socket.io"); // load external modules or libraries 
const io = socket(server); // create a socket.io instance called "io" and connect it with "server" (created above)

io.on("connection", newConnection);
function newConnection(sck) {
  console.log("New Connection - ID: " + sck.id);

  client_count += 1;
  if (client_count != 1) {
    console.log(client_count);
    sck.broadcast.emit("newcomerAskForBall", "Please!");
  }

  // sck.name = client_count;
  // clients[sck.name] = sck.id;
  // console.log("clients:",clients);


  sck.on("clientOutBall", receive); // sets up a listener for a custom event called "clientOutPos"
  function receive(data) {   // what you receive is "data"
    //https://socket.io/docs/v3/emit-cheatsheet/index.html
    // console.log(data);
    // console.log("from socket " + sck.name + ": " + data);
    sck.broadcast.emit("serverOutBall", data); // send to all except for the sender

  }
}










