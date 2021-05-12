import React, { useState , useEffect } from 'react';
import { Link } from "react-router-dom";
import './style.css';
import AllCards from '../Game/AllCards';
import Package from './imgs/han_nin_ha_odoru_v4-box.jpeg';
import realCards from './imgs/han_nin_ha_odoru_v4-6cards-w900.jpeg';
import FooterLogo from '../Game/logo/footerLogo.svg';

const Entrance=(props)=>{
    const [userName, setUserName] = useState("");
    const [roomName, setRoomName] = useState("");
    
    const changeUserName = (event) => {
    setUserName(event.target.value);
  };

  const changeRoomName = (event) => {
    setRoomName(event.target.value);
  };
    
    return(
    <div className="container-fluid">
      <div className="row">
        <div className="row">


        <div className="col-md-6 pt-3 pb-4 pr-3 pl-3">
          <div className="card m-1 h-100 shadow-sm p-2">
            <div className="card-body">
              <div className="row w-100 h-100">
                  <div className="col-10 mx-auto pt-3">
                    <div className="row">
                      <div className="col-5">
                        <img src={Package} className="w-100"/>
                      </div>
                      <div className="col-7 align-content-center">
                        <img src={realCards} className="w-100"/>
                      </div>
                    </div>
                    <div className="col-11 mx-auto">
                     <p className="mb-1">「犯人は踊る」というカードゲームをwebアプリ化したものです。</p>
                     <a href="https://www.youtube.com/watch?v=v97PP5AHF5w" className="how-to-play"><span className="mb-0">▶︎遊び方</span></a>
                    </div>
                  </div>
              </div>
            
              </div>
          </div>
        </div>


        <div className="col-md-6 p-3">
          <div className="card m-1 w-100 shadow-sm">
            <div className="card-body">
              <div className="row w-100">
                <h4>{props.title}</h4>
              </div>
              <div className="row w-100 pt-2">
                <label>名前</label>
                <div>
                  <input
                    className="w-100"
                    value={userName}
                    onChange={changeUserName}
                  />
                </div>
              </div>
              <div className="row w-100 pt-2">
                <label>部屋名</label>
                  <div>
                    <input
                      className="w-100"
                      value={roomName}
                      onChange={changeRoomName}
                    />
                </div>
              </div>
          
              <div className="row">
                <div className="pt-3">
                  <Link
                    onClick={(e) =>
                      !userName || !roomName ? e.preventDefault() : null
                    }
                    to={`/ready?userName=${userName}&roomName=${roomName}&builder=true`}
                  >
                  <button className="btn btn-primary">部屋を作成</button>
                  </Link>
                </div>
                <div className="pt-3">
                  <Link
                    onClick={(e) =>
                      !userName || !roomName ? e.preventDefault() : null
                    }
                    to={`/ready?userName=${userName}&roomName=${roomName}&builder=false`}
                  >
                  <button className="btn btn-primary">部屋に参加</button>
                  </Link>
                </div>
              </div>
              </div>
          </div>
        </div>


      </div>
      
      <div className="row">
          <div className="col-12 p-3">
              <div className="card p-3 shadow-sm">
                  <p>ゲームのはじめ方</p>
                  <p>上の「名前」の欄に自分の名前を入力してください。新規に部屋を作成する場合は部屋名を入力してから「部屋を作成」ボタンを押してください。誰かの部屋に入る場合は部屋の作成者から部屋名を聞いて欄に入力し、「部屋に参加」ボタンを押してください。</p>
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

      </div>

      <div className="row pt-4 pb-4">
                    <div className="col-2 mx-auto">
                        <img src={FooterLogo} />
                    </div>
                </div>
    </div>
        )
}

export default Entrance;