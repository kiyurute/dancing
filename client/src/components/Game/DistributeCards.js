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

const DistributeCards = (arr) => {
    
    
    const [myCardA,setMyCardA] = useState();
    const [myCardB,setMyCardB] = useState();
    const [myCardC,setMyCardC] = useState();
    const [myCardD,setMyCardD] = useState();
            
            switch(arr[0].cardName){
                case 'alibi':
                    setMyCardA(alibi);
                    break;
                
                case 'boy':
                    setMyCardA(boy);
                    break;
                    
                case 'criminal':
                    setMyCardA(criminal);
                    break;
        
                case 'dealing':
                    setMyCardA(dealing);
                    break;
                    
                case 'detective':
                    setMyCardA(detective);
                    break;
                    
                case 'discoverer':
                    setMyCardA(discoverer);
                    break;
                
                case 'dog':
                    setMyCardA(dog);
                    break;
                
                case 'manipulation':
                    setMyCardA(manipulation);
                    break;
                    
                case 'normal':
                    setMyCardA(normal);
                    break;
                    
                case 'plan':
                    setMyCardA(plan);
                    break;
                    
                case 'rumor':
                    setMyCardA(rumor);
                    break;
                
                case 'witness':
                    setMyCardA(witness);
                    break;
            
            }
                
            switch(arr[1].cardName){
                case 'alibi':
                    setMyCardB(alibi);
                    break;
                
                case 'boy':
                    setMyCardB(boy);
                    break;
                    
                case 'criminal':
                    setMyCardB(criminal);
                    break;
        
                case 'dealing':
                    setMyCardB(dealing);
                    break;
                    
                case 'detective':
                    setMyCardB(detective);
                    break;
                    
                case 'discoverer':
                    setMyCardB(discoverer);
                    break;
                
                case 'dog':
                    setMyCardB(dog);
                    break;
                
                case 'manipulation':
                    setMyCardB(manipulation);
                    break;
                    
                case 'normal':
                    setMyCardB(normal);
                    break;
                    
                case 'plan':
                    setMyCardB(plan);
                    break;
                    
                case 'rumor':
                    setMyCardB(rumor);
                    break;
                
                case 'witness':
                    setMyCardB(witness);
                    break;
 
            }
            
            
        }
        
    export default DistributeCards;