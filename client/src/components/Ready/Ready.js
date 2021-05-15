import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import Game from '../Game/Game';

import './style.css'
import AllCards from '../Game/AllCards'
import FooterLogo from '../Game/logo/footerLogo.svg';

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

        socket.on('memberLimit',() => {
            alert('人数が上限です');
            window.location.href = 'http://localhost:3000/entrance';
        })

        socket.on('roomNoExist',() => {
            alert('部屋が存在しません');
            window.location.href = 'http://localhost:3000/entrance';
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

                <div className="row header fixed-top">
                        <div className="col-12 pl-5">
                            <p className="player-name pl-5">  ルーム名：{roomName}｜プレイヤー名：{userName}</p>
                        </div>
                </div>

                <div className="row header">
                        <div className="col-12 p-0">
                            <p className="player-name">　ルーム名：{roomName}|プレイヤー名：{userName}</p>
                        </div>
                </div>

            <div className="row pl-3 pr-3">
                <div className="col-12 p-3">
                    <div className='card p-3 shadow-sm'>
                        <p>現在の参加者</p>
                        {members.map((value)=>{
                            return(
                                <div key={value}>
                                    <p>{value}</p>
                                </div>
                            );
                        })}
                        {startButton}
                    </div>
                </div>
            </div>


            <div className="row">
                    <div className="col-12 p-3">
                        <div className="card p-3 shadow-sm">
                            <p>※注意：ゲームが開始したらブラウザのリロードをしないで下さい。</p>
                            <p>ルール等</p>
                            <p>自分の番になったら自分のカードの中から一枚選んで使ってください。勝つ方法は次の3通りです。<br></br>・「探偵」のカードを使って犯人を持っている人を当てる<br></br>・「犯人」のカードを最後の一枚で使う<br></br>・「たくらみ」を使って犯人と一緒に勝つ</p>
                        </div>
                    </div>
            </div>

            <div className="row">
                    <div className="col-12 p-3">
                        <div className="card p-3 shadow-sm">
                            <p>カード一覧</p>
                            <AllCards />
                        </div>
                    </div>
            </div>

            <div className="row pt-4 pb-4">
                <div className="col-2 mx-auto">
                    <img src={FooterLogo} />
                </div>
            </div>
        
        </div>
        )
    
}

export default Ready;
