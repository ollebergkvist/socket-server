require("dotenv").config(); // Requires and configs dotenv

// Express server
const express = require("express");
const app = express();

// Socket.io
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.origins(["https://socket-client.jsramverk.se:443"]); // Allows client to communicate with server

// Creates socket.io connection
io.on("connection", (socket) => {
    // Listens on connection event
    console.info("a user connected"); // Prints connection message event

    // Listens on disconnect event
    socket.on("disconnect", () => {
        console.log("user disconnected"); // Prints chat message event
    });

    // Listens on message event
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg); // Prints disconnection message event
    });
});

// Starts server and sets what port to listen to
server.listen(process.env.EXPRESS_PORT, () => {
    console.log("Express server is up and running"); // Prints server message
});
