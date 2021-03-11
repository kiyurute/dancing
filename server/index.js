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

const SetCards = require('./SetCards');

function createTable(tableName,userName,builder){
    console.log('in the createTable');
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

function checkMemberDuplicate(tableName,userName,builder){
    console.log('in the checkmemberduplicate');
    return new Promise((resolve,reject) => {
        connection.query(
            'SELECT * FROM ??',
            [tableName],
            (error,results) => {
                
            results.map((val)=>{
                 console.log('in the map');
                    if(val.userName === userName){
                        return reject;
                    }
                });
            
            return resolve(tableName,userName,builder);
                
            })
    })
    
}

function registerMember(tableName,userName,builder){
    console.log('in the registerMamber');
    
   
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
    let gameRoomName;
    let cardTableName;
    
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
            let nameDuplicate;
            
            if(builder === 'true'){
                    builder = 1;
                }else{
                    builder = 0;
                }
            
            connection.query(
                'SELECT * FROM ??',
                [tableName],
                (error,results) => {
                    
                        results.map((val) => {
                            
                            if(val.userName === userName){
                                console.log('nameDuplicate deteceted');
                                nameDuplicate = true;
                            }
                            
                        })
                        
                        if(nameDuplicate){
                            socket.to(roomName).emit('getReady',results);
                            socket.emit('getReady',results);
                        }else{        
                        connection.query(
                            'INSERT INTO ?? VALUE (0,?,?)',
                            [tableName, userName, builder],
                            (error,results) => {
                                if(error){console.log(error)}else{console.log('register complete')}
                                connection.query(
                                    'SELECT * FROM ??',
                                    [tableName],
                                    (error,results) => {
                                        socket.to(roomName).emit('getReady',results);
                                        socket.emit('getReady',results);
                                    })
                            })
                        }            
                                    
                }
                
        )}
        
        
        
    })
    
    
    
    
    socket.on('gameStart',(newUserName,newRoomName,builder) => {
        userName = newUserName;
        roomName = newRoomName;
        tableName = 'member_list_of_'+newRoomName;
        cardTableName = 'card_list_of_'+newRoomName
        socket.join(roomName);
        
        
        if(builder === 'true'){
            let players;
            connection.query(
                    'SELECT * FROM ??',
                    [tableName],
                    (error,results) => {
                        players = results;
                        
                        connection.query(
                            'TRUNCATE TABLE ??',
                            [cardTableName],
                            (error,results) => {
                                connection.query(
                            'CREATE TABLE ??(id INT AUTO_INCREMENT,cardName TEXT,PRIMARY KEY(id))',
                            [cardTableName],
                            (error,results) => {
                                let cardArr = SetCards(players.length);
                                
                                cardArr.map((val) => {
                                    connection.query(
                                        'INSERT INTO ?? VALUE (0,?)',
                                        [cardTableName,val],
                                        (error,results) => {
                                        })
                                })
                                
                                connection.query(
                                    'SELECT * FROM ??',
                                    [cardTableName],
                                    (error,results) => {
                                        socket.to(roomName).emit('loadGame',players,results);
                                        socket.emit('loadGame',players,results);
                                    })
                            }
                            )
                                
                            }
                            )
                        
                        // connection.query(
                        //     'CREATE TABLE ??(id INT AUTO_INCREMENT,cardName TEXT,PRIMARY KEY(id))',
                        //     [cardTableName],
                        //     (error,results) => {
                        //         let cardArr = SetCards(players.length);
                                
                        //         cardArr.map((val) => {
                        //             connection.query(
                        //                 'INSERT INTO ?? VALUE (0,?)',
                        //                 [cardTableName,val],
                        //                 (error,results) => {
                        //                 })
                        //         })
                                
                        //         connection.query(
                        //             'SELECT * FROM ??',
                        //             [cardTableName],
                        //             (error,results) => {
                        //                 socket.to(roomName).emit('loadGame',players,results);
                        //                 socket.emit('loadGame',players,results);
                        //             })
                        //     }
                        //     )
                            
                            
                        
                    })
        }else{
            let players;
            connection.query(
                    'SELECT * FROM ??',
                    [tableName],
                    (error,results) => {
                        players = results;
                        connection.query(
                            'SELECT * FROM ??',
                            [cardTableName],
                            (error,results) => {
                                socket.to(roomName).emit('loadGame',players,results);
                                socket.emit('loadGame',players,results);
                            })
                        
                    })
        }
        
    })
    
    socket.on('loadComp',(newUserName,newRoomName,newBuilder)=>{
        gameRoomName = newRoomName + '_game'
        socket.join('gameRoomName');
    })
    
    
    socket.on('disconnect',(event)=>{
        console.log('user left');
        console.log(gameRoomName);
        
    })
})

server.listen(PORT,() => console.log('listening on 8081')); 