import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import Backs from './Backs';
import MyCards from './MyCards';

let socket;

const Game = ({location}) => {
    
    const [userName,setUserName] = useState('');
    const [roomName,setRoomName] = useState('');
    const [builder,setBuilder] = useState('');
    const [members,setMembers] = useState(0);
    const [gameState,setGameState] = useState('ready');
    const [loadMember,setLoadMember] = useState('off');
    const [memberData,setMemberData] = useState([]);
    const [myCards,setMyCards] = useState();
    const ENDPOINT='https://e0f956dc573149fcb26e0a1aecf31d9e.vfs.cloud9.ap-northeast-1.amazonaws.com:8081';
    const [turnNum,setTurnNum] = useState();
    
    
    useEffect(()=>{
        const { userName,roomName,builder } = queryString.parse(location.search);
        setUserName(userName);
        setRoomName(roomName);
        setBuilder(builder);
        
        console.log(builder);
        
        socket = io(ENDPOINT);
        
        socket.on('connect',()=>{
            socket.emit('gameStart',userName,roomName,builder);
        })
        
        
        socket.on('loadGame',(queryResults,cards) => {
            console.log('cards is');
            console.log(cards);
            let arr = [];
            queryResults.map((val,i) => {
                arr.push(<Backs name={val.userName} key={i}/>)
            })
            setMemberData(arr);
            setMyCards(<MyCards players={queryResults} cards={cards} playerName={userName}/>)
            console.log('memberData is');
            console.log(memberData);
            
            
            
            socket.emit('loadComp',userName,roomName,builder);
        })
        
        setTurnNum(1);
        
    },[])
    
    
    
    return(
        <div className="container-fluid">
            <div className="row">
            
                <div className="col-md-6">
                    <div className="card">
                        <p>ターン:<span>{turnNum}</span>/4</p>
                        {memberData}
                        {console.log('rendering')}
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="card">
                        <p>あなたのカード</p>
                        {myCards}
                    </div>
                </div>
                
            </div>
        </div>
        )
}

export default Game;