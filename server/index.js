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
    password:'choco',
    database:'cardgame_project'
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
                        
                 
                            
                        
                    })
        
        connection.query(
            'CREATE TABLE ??(id INT AUTO_INCREMENT,message TEXT,turnmessage BOOLEAN,PRIMARY KEY(id))',
            ['msg_list_of_'+newRoomName],
            (error,results) => {}
            )
            
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
    
    
    socket.on('alibi',(cardID,alibiName) => {
        let cards;
        connection.query(
            `UPDATE ?? SET cardName='empty' WHERE id=?`,
            [cardTableName,cardID],
            (error,results) => {
                connection.query(
                    'SELECT * FROM ??',
                    [cardTableName],
                    (error,results) => {
                        cards = results
                        socket.to(roomName).emit('alibiComp',cards,alibiName);
                        socket.emit('alibiComp',cards,alibiName);
                    }
                    )
            }
            )
    })
    
    
    
    socket.on('rumor',(cardID) => {
        console.log('rumor');
        let cards;
        
        let AllCards;
        let firstCardSet;
        let secondCardSet;
        let thirdCardSet;
        
        let selectedFromFirstCardSet;
        let selectedFromSecondCardSet;
        let selectedFromThirdCardSet;
        
        connection.query(
            `UPDATE ?? SET cardName='empty' WHERE id=?`,
            [cardTableName,cardID],
            (error,results) => {
                connection.query(
                    'SELECT * FROM ??',
                    [cardTableName],
                    (error,results) => {
                        AllCards = results;
                        console.log(AllCards);
                        firstCardSet = AllCards.slice(0,4);
                        secondCardSet = AllCards.slice(4,8);
                        thirdCardSet = AllCards.slice(8,12);
                        
                        console.log(firstCardSet);
                        console.log(secondCardSet);
                        console.log(thirdCardSet);
                        
                        const generateRandomNum = (cardSet) => {
                            let randomNum = Math.floor(Math.random()*cardSet.length);
                            console.log(cardSet[randomNum].cardName);
                            while(cardSet[randomNum].cardName === 'empty'){
                                randomNum = Math.floor(Math.random()*cardSet.length);
                            }
                            return randomNum;
                        }
                        
                        selectedFromFirstCardSet = firstCardSet[generateRandomNum(firstCardSet)];
                        selectedFromSecondCardSet = secondCardSet[generateRandomNum(secondCardSet)];
                        selectedFromThirdCardSet = thirdCardSet[generateRandomNum(thirdCardSet)];
                        
                        console.log(selectedFromFirstCardSet.id);
                        console.log(selectedFromSecondCardSet.id);
                        console.log(selectedFromThirdCardSet.id);
                        
                        connection.query(
                            `UPDATE ?? SET cardName=? WHERE id=?`,
                            [cardTableName,selectedFromSecondCardSet.cardName,selectedFromFirstCardSet.id],
                            (error,results) => {
                                connection.query(
                                    `UPDATE ?? SET cardName=? WHERE id=?`,
                                    [cardTableName,selectedFromThirdCardSet.cardName,selectedFromSecondCardSet.id],
                                    (error,results) => {
                                        connection.query(
                                            `UPDATE ?? SET cardName=? WHERE id=?`,
                                            [cardTableName,selectedFromFirstCardSet.cardName,selectedFromThirdCardSet.id],
                                            (error,results) => {
                                                connection.query(
                                                    'SELECT * FROM ??',
                                                    [cardTableName],
                                                    (error,results) => {
                                                        cards = results;
                                                        console.log(cards);
                                                        socket.to(roomName).emit('rumorComp',cards,selectedFromFirstCardSet,selectedFromSecondCardSet,selectedFromThirdCardSet);
                                                        socket.emit('rumorComp',cards,selectedFromFirstCardSet,selectedFromSecondCardSet,selectedFromThirdCardSet);
                                                    }
                                                    )
                                            }
                                            )
                                    }
                                    )
                            }
                            )
                }
                )
            }
            )
    })
    
    
    socket.on('discoverer',(userName) => {
        let cards;
        console.log('discoverer');
        connection.query(
            `UPDATE ?? SET cardName='empty' WHERE cardName='discoverer'`,
            [cardTableName],
            (error,results) => {
                connection.query(
                    'SELECT * FROM ??',
                    [cardTableName],
                    (error,results) => {
                        cards = results;
                        
                                socket.to(roomName).emit('discovererComp',cards,userName);
                                socket.emit('discovererComp',cards,userName); 
                  
                    }
                    )
            })
    })
    
    let originPlayer,originCard,opponentPlayer,opponentCard;
    
    socket.on('dealing',(originPName,opponentPName,cardName,cardID) => {
        console.log(originPName,opponentPName,cardName);
        originPlayer = originPName;
        originCard = cardName;
        opponentPlayer = opponentPName
        socket.to(roomName).emit('dealingOpponent',originPlayer,originCard,opponentPlayer,cardID)
    })
    
    socket.on('dealingOpponentComp',(originPlayer,originCard,opponentPlayer,opponentCard,cardID) => {
        
        console.log(originPlayer,originCard,opponentPlayer,opponentCard,cardID);
        
        let originID,opponentID;
        let originCards;
        let opponentCards;
        let allCards;
        let originCardID,opponentCardID;
        
        const dealingCalc = async() => {
            
            await connection.query(
                `UPDATE ?? SET cardName='empty' WHERE id=?`,
                [cardTableName,cardID],
                (error,results) => {}
                )
 
            
            await connection.query(
                'SELECT id FROM ?? WHERE userName = ?',
                [tableName,originPlayer],
                (error,results) => {
                    console.log(results[0].id);
                    originID = results[0].id;
                }
                )
            
            await connection.query(
                'SELECT id FROM ?? WHERE userName = ?',
                [tableName,opponentPlayer],
                (error,results) => {
                    console.log(results[0].id);
                    opponentID = results[0].id;
                }
                )
                
            await connection.query(
                'SELECT * FROM ??',
                [cardTableName],
                (error,results) => {
                    console.log(results);
                    allCards = results;
                    originCards = allCards.slice((originID-1)*4,(originID-1)*4+4);
                    opponentCards = allCards.slice((opponentID-1)*4,(opponentID-1)*4+4);
                    console.log(originCards);
                    console.log(opponentCards);
                    
                    originCards.forEach((card)=>{
                        if(card.cardName === originCard){
                            originCardID = card.id;
                            console.log(originCardID);
                        }
                    })
                    
                    opponentCards.forEach((card)=>{
                        if(card.cardName === opponentCard){
                            opponentCardID =card.id;
                            console.log(opponentCardID);
                        }
                    })
                    
                    connection.query(
                        `UPDATE ?? SET cardName=? WHERE id=?`,
                        [cardTableName,opponentCard,originCardID],
                        (error,results) => {
                            connection.query(
                               `UPDATE ?? SET cardName=? WHERE id=?`,
                               [cardTableName,originCard,opponentCardID],
                               (error,results) => {
                                   connection.query(
                                        'SELECT * FROM ??',
                                        [cardTableName],
                                        (error,results) => {
                                            console.log(results);
                                            socket.to(roomName).emit('dealingComp',results,originPlayer,opponentPlayer);
                                            socket.emit('dealingComp',results,originPlayer,opponentPlayer);
                                        }
                                    )
                                   
                               }
                            )
                            
                        }
                    )
                    
                    
                    
                    
                }
                )

            
                
                
                
        }//end async
                
        dealingCalc();
            
        
    })
    
    socket.on('manipulationKick',(cardID,userName) => {
        console.log(cardID);
        const manipulationKickFunc = async() => {
        
            await connection.query(
                `UPDATE ?? SET cardName='empty' WHERE id=?`,
                [cardTableName,cardID],
                (error,results) => {}
                )
            
            await connection.query(
                'SELECT * FROM ??',
                [cardTableName],
                (error,results) => {
                    console.log(results);
                    socket.to(roomName).emit('manipulationChoice',results,userName);
                    socket.emit('manipulationChoice',results,userName);
                }
                )
            
        }
        
        manipulationKickFunc();
    })
    
   
    socket.on('manipulationSelected',(cardID,userName,userID) => {
        console.log(cardID,userName);
        console.log('memberID is');
        console.log(userID);
        manipulationUserArr.push(userID);
        manipulationCardArr.push(cardID);
        console.log(manipulationUserArr);
        console.log(manipulationCardArr);
        //全員左隣の人に手札の一枚こっそり渡す→idが小さい人に一枚渡す
        if(manipulationUserArr.length >= 3){
            let allCards;
            
            manipulationUserArr.map((userID) => {
                switch(userID){
                    case 1:
                        manipulationNewCardArr[0] = manipulationCardArr[manipulationUserArr.indexOf(1)];
                        break;
                    case 2:
                        manipulationNewCardArr[1] = manipulationCardArr[manipulationUserArr.indexOf(2)];
                        break;
                    case 3:
                        manipulationNewCardArr[2] = manipulationCardArr[manipulationUserArr.indexOf(3)];
                        break;
                }
            })
            
            console.log('manipulationNewCardArr is');
            console.log(manipulationNewCardArr);
            
            connection.query(
                'SELECT * FROM ??',
                [cardTableName],
                (error,results) => {
                    allCards = results;
                    console.log('before manipulation is');
                    console.log(allCards);
                    //2が選んだカードを1にセット
                    connection.query(
                        `UPDATE ?? SET cardName=? WHERE id=?`,
                        [cardTableName,allCards[manipulationNewCardArr[1]-1].cardName,manipulationNewCardArr[0]],
                        (error,results) => {
                            
                            //３が選んだカードを２にセット
                            connection.query(
                                `UPDATE ?? SET cardName=? WHERE id=?`,
                                [cardTableName,allCards[manipulationNewCardArr[2]-1].cardName,manipulationNewCardArr[1]],
                                (error,results) => {
                                    
                                    //１が選んだカードを３にセット
                                    connection.query(
                                        `UPDATE ?? SET cardName=? WHERE id=?`,
                                        [cardTableName,allCards[manipulationNewCardArr[0]-1].cardName,manipulationNewCardArr[2]],
                                        (error,results) => {
                                            
                                            connection.query(
                                                'SELECT * FROM ??',
                                                [cardTableName],
                                                (error,results) => {
                                                    console.log('after manipulation is');
                                                    console.log(results);
                                                    manipulationUserArr = [];
                                                    manipulationCardArr = [];
                                                    manipulationNewCardArr = [];
                                                    socket.to(roomName).emit('manipulationComp',results);
                                                    socket.emit('manipulationComp',results);
                                                }
                                                )
                                        }
                                        )
                                }
                                
                                )
                        }
                        )
            })
        }
    })
    
    socket.on('dog',(cardID) => {
        connection.query(
            'SELECT * FROM ??',
            [cardTableName],
            (error,results) => {
                socket.emit('dogGetAllCards',results,cardID);
            }
            )
    })

    socket.on('dogSelect',(selectedCard,selectedPlayer,cardID,userName) => {
        console.log(selectedCard,selectedPlayer,cardID);

        const dogSelectCalc = async() => {
            await connection.query(
                `UPDATE ?? SET cardName='empty' WHERE id=?`,
                [cardTableName,cardID],
                (error,results) => {}
                )

            let selectedCardID = (selectedPlayer-1)*4+selectedCard+1;
            let selectedCardData,allCards;

            await connection.query(
                `SELECT * FROM ?? WHERE id=?`,
                [cardTableName,selectedCardID],
                (error,results) => {
                    console.log(results);
                    selectedCardData = results;
                }
            )

            await connection.query(
                'SELECT * FROM ??',
                [cardTableName],
                (error,results) => {
                    allCards = results;
                    socket.to(roomName).emit('dogComp',selectedCardData,selectedPlayer,userName,allCards);
                    socket.emit('dogComp',selectedCardData,selectedPlayer,userName,allCards);
                }
            )
        }

        dogSelectCalc()
    })

    socket.on('witnessSelect',(selectedPlayer,cardID,userName) => {
        const witnessCalc = async() => {
            await connection.query(
                `UPDATE ?? SET cardName='empty' WHERE id=?`,
                [cardTableName,cardID],
                (error,results) => {
                    
                }
                )

            await connection.query(
                'SELECT * FROM ??',
                [cardTableName],
                (error,results) => {
                    socket.to(roomName).emit('witnessCompOther',selectedPlayer,userName,results);
                    socket.emit('witnessCompSelf',selectedPlayer,userName,results);
                }
            )

            
        }

        witnessCalc()
    })

    socket.on('normal',(cardID,normalPlayerName) => {
        const normalCalc = async() => {
            await connection.query(
                `UPDATE ?? SET cardName='empty' WHERE id=?`,
                [cardTableName,cardID],
                (error,results) => {
                }
            )

            await connection.query(
                'SELECT * FROM ??',
                [cardTableName],
                (error,results) => {
                    socket.to(roomName).emit('normalComp',results,normalPlayerName);
                    socket.emit('normalComp',results,normalPlayerName);
                }
            )
        }

        normalCalc()
    })

    socket.on('boy',(cardID,boyPlayerName) => {
        const dogCalc = async() => {
            await connection.query(
                `UPDATE ?? SET cardName='empty' WHERE id=?`,
                [cardTableName,cardID],
                (error,results) => {
                }
            )

            await connection.query(
                'SELECT * FROM ??',
                [cardTableName],
                (error,results) => {
                    socket.to(roomName).emit('boyCompOther',results,boyPlayerName);
                    socket.emit('boyCompSelf',results,boyPlayerName);
                }
            )
        }

        dogCalc()
    })
    
    socket.on('disconnect',(event)=>{
        console.log('user left');
        console.log(gameRoomName);
        
    })
    
    
    
})

let manipulationUserArr = [];
let manipulationCardArr = [];
let manipulationNewCardArr = [];

server.listen(PORT,() => console.log('listening on 8081')); 