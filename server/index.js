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

connection.connect(function(err) {
  if (err) throw err;
  console.log("You are connected!");
});


app.use(router);

function createTable(tableName,userName,builder){
  
    return new Promise((resolve, reject) => {
        connection.query(
                'CREATE TABLE ??(id INT AUTO_INCREMENT, userName TEXT, builder BOOLEAN, PRIMARY KEY(id))',
                [tableName],
                (error,results)=>{
                    resolve(tableName,userName,builder);
                    console.log(results);
                });
    });
    
} 

function registerMember(tableName,userName,builder){
    if(builder === 'true'){
        builder = 1;
    }else{
        builder = 0;
    }
    return new Promise((resolve,reject) => {
        connection.query(
            'INSERT INTO ?? VALUE (0,?,?)',
            [tableName, userName, builder],
            (error,results)=>{
                console.log(error);
                resolve(tableName);
            })
    })
}

function removeMember(userName,tableName){
    return new Promise((resolve,reject) => {
        connection.query(
        'DELETE FROM ?? WHERE userName=?',
        [tableName,userName],
        (error,results) => {
            console.log(error);
            resolve(tableName);
        });
    })

}

function checkEmpty(tableName){
    connection.query(
        'SELECT * FROM ??',
        [tableName],
        (error,results) => {
            console.log("empty is");
            console.log(results);
            if(results === undefined){
                connection.query(
                    'DROP TABLE ??',
                    [tableName],
                    (error,results) => {}
                    )
            }
        })
}

io.on(('connect'),(socket)=>{
    console.log('we have new connection');
    
    let userName;
    let roomName;
    let tableName;
    
    socket.on('ready',(newUserName,newRoomName,builder)=>{
        userName = newUserName;
        roomName = newRoomName;
        tableName = 'member_list_of_'+roomName;
        socket.join(roomName);
        
        if(builder === 'true'){
            createTable(tableName,userName,builder)
                .then(registerMember(tableName,userName,builder))
                .then(connection.query(
                    'SELECT * FROM ??',
                    [tableName],
                    (error,results) => {
                        socket.to(roomName).emit('getReady',results);
                        socket.emit('getReady',results);
                    }
                ));
        }else{
            registerMember(tableName,userName,builder)
                .then(connection.query(
                    'SELECT * FROM ??',
                    [tableName],
                    (error,results) => {
                        socket.to(roomName).emit('getReady',results);
                        socket.emit('getReady',results);
                    }
                ));
        }
        
        
        
    })
    
    socket.on('gameStart',() => {
        socket.to(roomName).emit('loadGame');
        socket.emit('loadGame');
    })
    
    socket.on('disconnect',()=>{
        removeMember(userName,tableName)
            .then(checkEmpty(tableName));
        
    })
})

server.listen(PORT,() => console.log('listening on 8081')); 