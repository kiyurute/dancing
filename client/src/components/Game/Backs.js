import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import backside from './cards/backside.svg';

const Backs = (props) => {
    
    return(
          <div className="row">
                <p>player1</p>
                <div className="col-3">
                <img src={backside} />
                </div>
                <div className="col-3">
                <img src={backside} />
                </div>
                <div className="col-3">
                <img src={backside} />
                </div>
                <div className="col-3">
                <img src={backside} />
                </div>
            </div>
        )
}

export default Backs;