import React, { useState , useEffect } from 'react';
import { Link } from "react-router-dom";

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
    <div className="row w-100">
        <div className="col-6 m-auto">
      <div className="card m-1 w-100">
        <div className="card-body">
          <div className="row w-100">
            <h4>{props.title}</h4>
          </div>
          <div className="row w-100 pt-2">
            <label>{props.firstLabel}</label>
            <div>
              <input
                className="w-100"
                value={userName}
                onChange={changeUserName}
              />
            </div>
          </div>
          <div className="row w-100 pt-2">
            <label>{props.secondLabel}</label>
            <div>
              <input
                className="w-100"
                value={roomName}
                onChange={changeRoomName}
              />
            </div>
          </div>
          
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
        )
}

export default Entrance;