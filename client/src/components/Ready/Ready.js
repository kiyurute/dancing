import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

let socket;

const Ready = ({location}) => {
    
    const [username,setUserName] = useState('');
    const [roomName,setRoomName] = useState('');
    const [members,setMembers] = useState(['one','two']);
    const ENDPOINT='https://e0f956dc573149fcb26e0a1aecf31d9e.vfs.cloud9.ap-northeast-1.amazonaws.com:8081';
    
    useEffect(()=>{
        const { userName,roomName,builder } = queryString.parse(location.search);
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
        
    },[])
    
    return(
        <div>
            <h1>犯人は踊る 待機室</h1>
            {members.map((value)=>{
                return(
                    <div>
                     <p>{value}</p>
                    </div>
                );
            })}
            <button className="btn btn-primary">開始</button>
        </div>
        )
    
}

export default Ready;
