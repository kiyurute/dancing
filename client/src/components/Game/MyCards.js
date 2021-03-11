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

const MyCards = (props) =>{
    
    const [myCardA,setMyCardA] = useState();
    const [myCardB,setMyCardB] = useState();
    const [myCardC,setMyCardC] = useState();
    const [myCardD,setMyCardD] = useState();
    const [turnState,setTurnState] = useState(false);
    
    let myCardsArr;
    
    useEffect(() => {
        
        console.log(props.players);
        console.log(props.cards);
        console.log(props.playerName);
        
        
        props.players.map((players) => {
            if(players.userName === props.playerName){
                console.log(props.cards.slice(players.id*4-4,players.id*4));
                myCardsArr = props.cards.slice(players.id*4-4,players.id*4);
            }
        })
        
        DistributeCards(myCardsArr);
        
        myCardsArr.map((val) => {
            if(val.cardName === 'discoverer'){
                setTurnState(true);
            }
        })
        
    })
    
    
    useEffect(() => {
        console.log(turnState);
    },[turnState])
    
    
    
    const DistributeCards = (myCardsArr) => {
        
        switch(myCardsArr[0].cardName){
                case 'alibi':setMyCardA(alibi);break;
                case 'boy':setMyCardA(boy);break;
                case 'criminal':setMyCardA(criminal);break;
                case 'dealing':setMyCardA(dealing);break;
                case 'detective':setMyCardA(detective);break;
                case 'discoverer':setMyCardA(discoverer);break;
                case 'dog':setMyCardA(dog);break;
                case 'manipulation':setMyCardA(manipulation);break;
                case 'normal':setMyCardA(normal);break;
                case 'plan': setMyCardA(plan);break;
                case 'rumor':setMyCardA(rumor);break;
                case 'witness':setMyCardA(witness);break;
            }
                
            switch(myCardsArr[1].cardName){
                case 'alibi':setMyCardB(alibi);break;
                case 'boy':setMyCardB(boy);break;
                case 'criminal':setMyCardB(criminal);break;
                case 'dealing':setMyCardB(dealing);break;
                case 'detective':setMyCardB(detective);break;
                case 'discoverer':setMyCardB(discoverer);break;
                case 'dog':setMyCardB(dog);break;
                case 'manipulation':setMyCardB(manipulation);break;
                case 'normal':setMyCardB(normal);break;
                case 'plan':setMyCardB(plan);break;
                case 'rumor':setMyCardB(rumor);break;
                case 'witness':setMyCardB(witness);break;
            }
            
             switch(myCardsArr[2].cardName){
                case 'alibi':setMyCardC(alibi);break;
                case 'boy':setMyCardC(boy);break;
                case 'criminal':setMyCardC(criminal);break;
                case 'dealing':setMyCardC(dealing);break;
                case 'detective':setMyCardC(detective);break;
                case 'discoverer':setMyCardC(discoverer);break;
                case 'dog':setMyCardC(dog);break;
                case 'manipulation':setMyCardC(manipulation);break;
                case 'normal':setMyCardC(normal);break;
                case 'plan':setMyCardC(plan);break;
                case 'rumor':setMyCardC(rumor);break;
                case 'witness':setMyCardC(witness);break;
            }
            
             switch(myCardsArr[3].cardName){
                case 'alibi':setMyCardD(alibi);break;
                case 'boy':setMyCardD(boy);break;
                case 'criminal':setMyCardD(criminal);break;
                case 'dealing':setMyCardD(dealing);break;
                case 'detective':setMyCardD(detective);break;
                case 'discoverer':setMyCardD(discoverer);break;
                case 'dog':setMyCardD(dog);break;
                case 'manipulation':setMyCardD(manipulation);break;
                case 'normal':setMyCardD(normal);break;
                case 'plan':setMyCardD(plan);break;
                case 'rumor':setMyCardD(rumor);break;
                case 'witness':setMyCardD(witness);break;
            }
            
        }
    
    
    return (
        <div>
        
            <div className='row pb-3'>
                <div className='col-6'>
                    <img src={myCardA} />
                </div>
                <div className='col-6'>
                    <img src={myCardB} />
                </div>
            </div>
            
            <div className='row'>
                <div className='col-6'>
                    <img src={myCardC} />
                </div>
                <div className='col-6'>
                    <img src={myCardD} />
                </div>
            </div>
        </div>
        )
        
        
        
        
}

export default MyCards;