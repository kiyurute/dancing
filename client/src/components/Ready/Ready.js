import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import Game from '../Game/Game';

let socket;

const Ready = ({location}) => {
    
    const [userName,setUserName] = useState('');
    const [roomName,setRoomName] = useState('');
    const [builder,setBuilder] = useState('');
    const [members,setMembers] = useState([]);
    const [gameState,setGameState] = useState('ready');
    //const ENDPOINT='https://e0f956dc573149fcb26e0a1aecf31d9e.vfs.cloud9.ap-northeast-1.amazonaws.com:8081';
    const ENDPOINT='localhost:8081';
    
    let gameStart;
    
    
    useEffect(()=>{
        const { userName,roomName,builder } = queryString.parse(location.search);
        setUserName(userName);
        setRoomName(roomName);
        setBuilder(builder);
        
        console.log(builder);
        
        socket = io(ENDPOINT);
        
        socket.on('connect',()=>{
            socket.emit('ready',userName,roomName,builder);
        })
        
        socket.on('getReady',(results) => {
            
            let temp = results.map((value) => {
                return value.userName;
            })
            
            setMembers(temp);
        })
        
        socket.on('loadGame',() => {
            console.log('loadGame');
            //let url = 'https://e0f956dc573149fcb26e0a1aecf31d9e.vfs.cloud9.ap-northeast-1.amazonaws.com/game?userName='+userName+'&roomName='+roomName+'&builder='+builder
            let url = 'http://localhost:3000/game?userName='+userName+'&roomName='+roomName+'&builder='+builder
            // window.location.href ='https://e0f956dc573149fcb26e0a1aecf31d9e.vfs.cloud9.ap-northeast-1.amazonaws.com/game'
            window.location.href =url
        })
        
        socket.on('nameDuplicate',() => {
            console.log('name duplicate');
            alert('name duplicate');
            
        })
    
        
    },[])
    
    
    
    let startButton;
    
    if(builder==='true'){
        
        startButton = (
            <Link
                to={`/game?userName=${userName}&roomName=${roomName}&builder=true&status=game`}
            >
                <button className="btn btn-primary">開始</button>
            </Link>
            )
    }else{}
    
    
    return(
        <div className="container-fluid">
            <h1>犯人は踊る 待機室</h1>
            {members.map((value)=>{
                return(
                    <div key={value}>
                     <p>{value}</p>
                    </div>
                );
            })}
            {startButton}
        </div>
        )
    
}

export default Ready;
