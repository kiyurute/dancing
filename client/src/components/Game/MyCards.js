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

function alibiFunc(){}
function boyFunc(){}
function criminalFunc(){}
function dealingFunc(){}
function detectiveFunc(){}
function discovererFunc(){}
function dogFunc(){}
function manipulationFunc(){}
function normalFunc(){}
function planFunc(){}
function rumorFunc(){}
function witnessFunc(){}

const MyCards = (props) =>{
    
    // const [myCardA,setMyCardA] = useState();
    // const [myCardB,setMyCardB] = useState();
    // const [myCardC,setMyCardC] = useState();
    // const [myCardD,setMyCardD] = useState();
    // const [turnState,setTurnState] = useState(false);
    // const [update,setUpdate] = useState(false);
    
    
    // useEffect(() => {
        
    //     console.log(props.players);
    //     console.log(props.myCards);
    //     console.log(props.playerName);
        
    //     DistributeCards(props.myCards);
        
    //     console.log('in mycards effect');
        
    // },[])
    

    
    // console.log(props.update)
    
    
    
    
    // const DistributeCards = (myCardsArr) => {
        

                
    
  
            
   
    //     }
    
    
    
        
        
    
    //--------------------------------------------------------------------------------------------------
    
    
    let MyCardA;
    let MyCardB;
    let MyCardC;
    let MyCardD;
    
    const DistributeCards = (myCardsArr) => {
        
        switch(myCardsArr[0].cardName){
                case 'alibi':MyCardA = (<img src={alibi} onClick={() => {props.alibiFunc(myCardsArr[0].id)}}/>);break;
                case 'boy':MyCardA = (<img src={boy} onClick={() => {props.boyFunc(myCardsArr[0].id)}}/>);break;
                case 'criminal':MyCardA = (<img src={criminal} onClick={() => {props.criminalFunc(myCardsArr[0].id)}}/>);break;
                case 'dealing':MyCardA = (<img src={dealing} onClick={() => {props.dealingFunc(myCardsArr[0].id)}}/>);break;
                case 'detective':MyCardA = (<img src={detective} onClick={() => {props.detectiveFunc(myCardsArr[0].id)}}/>);break;
                case 'discoverer':MyCardA = (<img src={discoverer} onClick={() => {props.discovererFunc(myCardsArr[0].id)}}/>);break;
                case 'dog':MyCardA = (<img src={dog} onClick={() => {props.dogFunc(myCardsArr[0].id)}}/>);break;
                case 'manipulation':MyCardA = (<img src={manipulation} onClick={() => {props.manipulationFunc(myCardsArr[0].id)}}/>);break;
                case 'normal':MyCardA = (<img src={normal} onClick={() => {props.normalFunc(myCardsArr[0].id)}}/>);break;
                case 'plan': MyCardA = (<img src={plan} onClick={() => {props.planFunc(myCardsArr[0].id)}}/>);break;
                case 'rumor':MyCardA = (<img src={rumor} onClick={() => {props.rumorFunc(myCardsArr[0].id)}}/>);break;
                case 'witness':MyCardA = (<img src={witness} onClick={() => {props.witnessFunc(myCardsArr[0].id)}}/>);break;
                case 'empty':break;
            }
                
            switch(myCardsArr[1].cardName){
                case 'alibi':MyCardB = (<img src={alibi} onClick={() => {props.alibiFunc(myCardsArr[1].id)}}/>);break;
                case 'boy':MyCardB = (<img src={boy} onClick={() => {props.boyFunc(myCardsArr[1].id)}}/>);break;
                case 'criminal':MyCardB = (<img src={criminal} onClick={() => {props.criminalFunc(myCardsArr[1].id)}}/>);break;
                case 'dealing':MyCardB = (<img src={dealing} onClick={() => {props.dealingFunc(myCardsArr[1].id)}}/>);break;
                case 'detective':MyCardB = (<img src={detective} onClick={() => {props.detectiveFunc(myCardsArr[1].id)}}/>);break;
                case 'discoverer':MyCardB = (<img src={discoverer} onClick={() => {props.discovererFunc(myCardsArr[1].id)}}/>);break;
                case 'dog':MyCardB = (<img src={dog} onClick={() => {props.dogFunc(myCardsArr[1].id)}}/>);break;
                case 'manipulation':MyCardB = (<img src={manipulation} onClick={() => {props.manipulationFunc(myCardsArr[1].id)}}/>);break;
                case 'normal':MyCardB = (<img src={normal} onClick={() => {props.normalFunc(myCardsArr[1].id)}}/>);break;
                case 'plan':MyCardB = (<img src={plan} onClick={() => {props.planFunc(myCardsArr[1].id)}}/>);break;
                case 'rumor':MyCardB = (<img src={rumor} onClick={() => {props.rumorFunc(myCardsArr[1].id)}}/>);break;
                case 'witness':MyCardB = (<img src={witness} onClick={() => {props.witnessFunc(myCardsArr[1].id)}}/>);break;
                case 'empty':break;
            }
            
             switch(myCardsArr[2].cardName){
                case 'alibi':MyCardC = (<img src={alibi} onClick={() => {props.alibiFunc(myCardsArr[2].id)}}/>);break;
                case 'boy':MyCardC = (<img src={boy} onClick={() => {props.boyFunc(myCardsArr[2].id)}}/>);break;
                case 'criminal':MyCardC = (<img src={criminal} onClick={() => {props.criminalFunc(myCardsArr[2].id)}}/>);break;
                case 'dealing':MyCardC = (<img src={dealing} onClick={() => {props.dealingFunc(myCardsArr[2].id)}}/>);break;
                case 'detective':MyCardC = (<img src={detective} onClick={() => {props.detectiveFunc(myCardsArr[2].id)}}/>);break;
                case 'discoverer':MyCardC = (<img src={discoverer} onClick={() => {props.discovererFunc(myCardsArr[2].id)}}/>);break;
                case 'dog':MyCardC = (<img src={dog} onClick={() => {props.dogFunc(myCardsArr[2].id)}}/>);break;
                case 'manipulation':MyCardC = (<img src={manipulation} onClick={() => {props.manipulationFunc(myCardsArr[2].id)}}/>);break;
                case 'normal':MyCardC = (<img src={normal} onClick={() => {props.normalFunc(myCardsArr[2].id)}}/>);break;
                case 'plan':MyCardC = (<img src={plan} onClick={() => {props.planFunc(myCardsArr[2].id)}}/>);break;
                case 'rumor':MyCardC = (<img src={rumor} onClick={() => {props.rumorFunc(myCardsArr[2].id)}}/>);break;
                case 'witness':MyCardC = (<img src={witness} onClick={() => {props.witnessFunc(myCardsArr[2].id)}}/>);break;
                case 'empty':;break;
            }
            
             switch(myCardsArr[3].cardName){
                case 'alibi':MyCardD = (<img src={alibi} onClick={() => {props.alibiFunc(myCardsArr[3].id)}}/>);break;
                case 'boy':MyCardD = (<img src={boy} onClick={() => {props.boyFunc(myCardsArr[3].id)}}/>);break;
                case 'criminal':MyCardD = (<img src={criminal} onClick={() => {props.criminalFunc(myCardsArr[3].id)}}/>);break;
                case 'dealing':MyCardD = (<img src={dealing} onClick={() => {props.dealingFunc(myCardsArr[3].id)}}/>);break;
                case 'detective':MyCardD = (<img src={detective} onClick={() => {props.detectiveFunc(myCardsArr[3].id)}}/>);break;
                case 'discoverer':MyCardD = (<img src={discoverer} onClick={() => {props.discovererFunc(myCardsArr[3].id)}}/>);break;
                case 'dog':MyCardD = (<img src={dog} onClick={() => {props.dogFunc(myCardsArr[3].id)}}/>);break;
                case 'manipulation':MyCardD = (<img src={manipulation} onClick={() => {props.manipulationFunc(myCardsArr[3].id)}}/>);break;
                case 'normal':MyCardD = (<img src={normal} onClick={() => {props.normalFunc(myCardsArr[3].id)}}/>);break;
                case 'plan':MyCardD = (<img src={plan} onClick={() => {props.planFunc(myCardsArr[3].id)}}/>);break;
                case 'rumor':MyCardD = (<img src={rumor} onClick={() => {props.rumorFunc(myCardsArr[3].id)}}/>);break;
                case 'witness':MyCardD = (<img src={witness} onClick={() => {props.witnessFunc(myCardsArr[3].id)}}/>);break;
                case 'empty':;break;
            }
            
        }
        
    DistributeCards(props.myCards);
        
        
    return (
        <div>
        
            <div className='row pb-3'>
                <div className='col-6'>
                    {MyCardA}
                </div>
                <div className='col-6'>
                    {MyCardB}
                </div>
            </div>
            
            <div className='row'>
                <div className='col-6'>
                    {MyCardC}
                </div>
                <div className='col-6'>
                    {MyCardD}
                </div>
            </div>
        </div>
        )
        
        
}

export default MyCards;