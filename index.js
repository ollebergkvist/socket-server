// Dotenv
require("dotenv").config(); // Requires and configs dotenv

// Express server
const express = require("express");
const app = express();

// Socket.io
const server = require("http").createServer(app);
const io = require("socket.io")(server);
io.origins([process.env.SOCKET_ORIGIN]); // Allows defined client to communicate with server

// Dateformat
var dateFormat = require("dateformat");

// Store messages and users
var messages = [];
var users = [];

// Creates socket.io connection
io.on("connection", (socket) => {
    // Listens on connection event
    console.info("a user connected"); // Prints connection message event

    socket.emit("init-chat", messages); // When user connects, the server sends the user all the current messages
    socket.emit("update-users", users); // When user connects, the server send the user a list with current users

    // When user connects. The server updates user list and emits an event
    // Listens on add-user event
    socket.on("add-user", (user) => {
        users.push({ id: socket.id, name: user });
        io.emit("update-users", users);
    });

    // When user disconnects from the server, user list updates and emits an event
    // Listens to dicsonnect event
    socket.on("disconnect", () => {
        users = users.filter(function (user) {
            return user.id != socket.id;
        });
        io.emit("update-users", users);
    });

    // When a user sends a message, server pushes the info to message list and emits an event
    // Listens on message event
    socket.on("send-message", (data) => {
        let newMessage = {
            text: data.message,
            user: data.user,
            date: dateFormat(new Date(), "default"),
        };
        messages.push(newMessage);
        io.emit("read-message", newMessage);
    });
});

// Starts server and sets what port to listen to
server.listen(process.env.EXPRESS_PORT, () => {
    console.log("Express server is up and running"); // Prints server message
});
