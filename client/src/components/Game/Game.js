import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import Backs from './Backs';

let socket;

const Game = ({location}) => {
    
    const [userName,setUserName] = useState('');
    const [roomName,setRoomName] = useState('');
    const [builder,setBuilder] = useState('');
    const [members,setMembers] = useState([]);
    const [gameState,setGameState] = useState('ready');
    const ENDPOINT='https://e0f956dc573149fcb26e0a1aecf31d9e.vfs.cloud9.ap-northeast-1.amazonaws.com:8081';
    
    
    
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
        
        // socket.on('getReady',(results) => {
            
        //     let temp = results.map((value) => {
        //         return value.userName;
        //     })
            
        //     setMembers(temp);
        // })
        
        socket.on('loadGame',() => {
            console.log('loadGame');
        })
    
        
    },[])
    
    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <p>ターン:1/4</p>
                        <Backs />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <p>あなたのカード</p>
                    </div>
                </div>
            </div>
        </div>
        )
}

export default Game;