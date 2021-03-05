import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import backside from './cards/backside.svg';

const Backs = (props) => {
    
    return(
          <div className="row">
                <p>{props.name}</p>
                <div className="col-3">
                <img src={backside} className='w-100' />
                </div>
                <div className="col-3">
                <img src={backside} className='w-100' />
                </div>
                <div className="col-3">
                <img src={backside} className='w-100' />
                </div>
                <div className="col-3">
                <img src={backside} className='w-100' />
                </div>
            </div>
        )
}

export default Backs;