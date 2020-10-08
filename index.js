// Dotenv
require("dotenv").config(); // Requires and configs dotenv

// Express server
const express = require("express");
const app = express();

// Socket.io
const server = require("http").createServer(app);
const io = require("socket.io")(server);
io.origins([process.env.SOCKET_ORIGIN]); // Allows defined client to communicate with server

// MongoDB
const mongoDB = require("./db/config/db");

// Dateformat
var dateFormat = require("dateformat");

// Store messages and users
var users = [];
var connectedUser = "";

// Creates socket.io connection
io.on("connection", (socket) => {
    socket.emit("active-user-list", users); // When user connects, the server send the user a list with current users

    // When user connects, the server sends the user all the current messages
    socket.on("get-history", function () {
        mongoDB
            .findItemsInCollection()
            .then((result) => {
                io.emit("receive-history", result);
            })
            .catch((error) => console.log(error));
    });

    // When a user sends a message, server pushes the info to message list and emits an event
    // Listens on message event
    socket.on("chat-message", (data) => {
        let newMessage = {
            text: data.message,
            user: data.user,
            date: dateFormat(new Date(), "default"),
        };
        io.emit("chat-message", newMessage);
        mongoDB.addItemToCollection(newMessage);
    });

    // When user connects. The server updates user list and emits an event
    // Listens on add-user event
    socket.on("add-user", (user) => {
        let newUser = {
            id: socket.id,
            name: user,
        };

        users.push(newUser);
        connectedUser = user;
        console.log(user + " connected");

        let newMessage = {
            text: "Connected to chat!",
            user: connectedUser,
            date: dateFormat(new Date(), "default"),
        };
        io.emit("add-user", newUser);
        socket.broadcast.emit("chat-message", newMessage);
    });

    // When user disconnects from the server, user list updates and emits an event
    // Listens to dicsonnect event
    socket.on("disconnect", () => {
        console.log(connectedUser + " disconnected");
        users = users.filter(function (user) {
            return user.id != socket.id;
        });

        let newMessage = {
            text: "Disconnected from chat!",
            user: connectedUser,
            date: dateFormat(new Date(), "default"),
        };

        io.emit("active-user-list", users);
        socket.broadcast.emit("chat-message", newMessage);
        connectedUser = "";
    });
});

// Starts server and sets what port to listen to
server.listen(process.env.EXPRESS_PORT, () => {
    console.log("Express server is up and running"); // Prints server message
});
