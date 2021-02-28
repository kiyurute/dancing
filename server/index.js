const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const router = require('./router');

const PORT = 8081;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const mysql = require('mysql');

const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'project'
});


app.use(router);

io.on(('connect'),(socket)=>{
    console.log('we have new connection');
    
    socket.on('joinRoom',(userName,roomName)=>{
        socket.join(roomName);
        socket.to(roomName).emit('newJoined',null);
        // socket.emit('newJoined',null);
        console.log('joinRoom emitted');
    })
    
    socket.on('disconnect',()=>{
        console.log('user left');
    })
})

server.listen(PORT,() => console.log('listening on 8081')); 