import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';


import alibi from './cards/alibi.svg';
import boy from './cards/boy.svg';
import criminal from './cards/criminal.svg';
import dealing from './cards/dealing.svg';
import detective from './cards/detective.svg';
import discoverer from './cards/discoverer.svg';
import dog from './cards/dog.svg';
import manipulation from './cards/manipulation.svg';
import normal from './cards/normal.svg';
import plan from './cards/plan.svg';
import rumor from './cards/rumor.svg';
import witness from './cards/witness.svg';

const AllCards = () => {
    return(
        <>
        <div className="row">
            <div className="col-md-6 pt-3">
                <div className="row">
                    <div className="col-6">
                        <img src={alibi}/>
                    </div>
                    <div className="col-6">
                        <img src={boy}/>
                    </div>
                </div>
            </div>
            <div className="col-md-6 pt-3">
                <div className="row">
                    <div className="col-6">
                        <img src={criminal}/>
                    </div>
                    <div className="col-6">
                        <img src={dealing}/>
                    </div>
                </div>
            </div>
        </div>



        <div className="row">
            <div className="col-md-6 pt-3">
                <div className="row">
                    <div className="col-6">
                        <img src={detective}/>
                    </div>
                    <div className="col-6">
                        <img src={witness}/>
                    </div>
                </div>
            </div>
            <div className="col-md-6 pt-3">
                <div className="row">
                    <div className="col-6">
                        <img src={discoverer}/>
                    </div>
                    <div className="col-6">
                        <img src={dog}/>
                    </div>
                </div>
            </div>
        </div>



        <div className="row">
            <div className="col-md-6 pt-3">
                <div className="row">
                    <div className="col-6">
                        <img src={manipulation}/>
                    </div>
                    <div className="col-6">
                        <img src={normal}/>
                    </div>
                </div>
            </div>
            <div className="col-md-6 pt-3">
                <div className="row">
                    <div className="col-6">
                        <img src={plan}/>
                    </div>
                    <div className="col-6">
                        <img src={rumor}/>
                    </div>
                </div>
            </div>
        </div>
            

        </>
    )
}

export default AllCards;