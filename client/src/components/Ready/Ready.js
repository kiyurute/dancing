import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

let socket;

const Ready = ({location}) => {
    
    const [username,setUserName] = useState('');
    const [roomName,setRoomName] = useState('');
    const ENDPOINT='https://e0f956dc573149fcb26e0a1aecf31d9e.vfs.cloud9.ap-northeast-1.amazonaws.com:8081';
    
    useEffect(()=>{
        const { userName,roomName,builder } = queryString.parse(location.search);
        console.log(builder);
        
        socket = io(ENDPOINT);
        
        socket.on('connect',()=>{
            socket.emit('ready',userName,roomName)
        })
        
    },[])
    
    return(
        <div>
        <h1>犯人は踊る 待機室</h1>
        </div>
        )
    
}

export default Ready;
