import React, { useState , useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';



let socket;

// import './Chat.css';

const Chat = ({location}) => {
    
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const ENDPOINT='https://e0f956dc573149fcb26e0a1aecf31d9e.vfs.cloud9.ap-northeast-1.amazonaws.com:8081'
    
    useEffect(()=>{
        
        const { name, room } = queryString.parse(location.search);
        
        socket = io(ENDPOINT);
        
        socket.on('connect',()=>{
            socket.emit('joinRoom',name,room);
        })
        
        socket.on('newJoined',()=>{
            console.log('get newJoined');
        })
        
        setName(name);
        setRoom(room);
        
        console.log(socket);


    },[])
    
    
    
    return(
        <div className='container'>
            <h1>Chat</h1>
        </div>
        )
}

export default Chat;