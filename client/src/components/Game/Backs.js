import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import backside from './cards/backside.svg';

const Backs = (props) => {
    
    let firstCardsSet = props.cards.slice(0,4);
    let secondCardsSet = props.cards.slice(4,8);
    let thirdCardsSet = props.cards.slice(8,12);
    
    console.log(firstCardsSet);
    console.log(secondCardsSet);
    console.log(thirdCardsSet);
    
    let firstCardView = [];
    let secondCardView = [];
    let thirdCardView = [];
    
    console.log(props.cards);
    console.log(props.members);
    
    firstCardsSet.map((cards,i) => {
        if(cards.cardName !== 'empty'){
            firstCardView.push(
                    <div className="col-3 pr-1 pl-0" key={i}>
                    <img src={backside} className='w-100' />
                    </div>
                    )
        }
    })
    
    secondCardsSet.map((cards,i) => {
        if(cards.cardName !== 'empty'){
            secondCardView.push(
                    <div className="col-3 pr-1 pl-0" key={i}>
                    <img src={backside} className='w-100' />
                    </div>
                    )
        }
    })
    
    thirdCardsSet.map((cards,i) => {
        if(cards.cardName !== 'empty'){
            thirdCardView.push(
                    <div className="col-3 pr-1 pl-0" key={i}>
                    <img src={backside} className='w-100' />
                    </div>
                    )
        }
    })


    const changeFontColor = (memberName,currentTurnMemberName) => {
        console.log(memberName,currentTurnMemberName)
        if(memberName === currentTurnMemberName){
            console.log('true');
            return (<p className='mb-0' style={{color:'rgb(162,152,173)'}}>▶︎{memberName}</p>);
        }else{
            console.log('false');
            return (<p className='mb-0'>{memberName}</p>)
        }
    }
    
    
    
    return(
        <div>
        
          <div className="row pb-3">
                {changeFontColor(props.members[0].userName,window.sessionStorage.getItem('turnState'))}
                {firstCardView}
           </div>
           
           <div className="row pb-3">
                {changeFontColor(props.members[1].userName,window.sessionStorage.getItem('turnState'))}
                {secondCardView}
           </div>
           
           <div className="row pb-3">
                {changeFontColor(props.members[2].userName,window.sessionStorage.getItem('turnState'))}
                {thirdCardView}
           </div>
         </div>
        )
}

export default Backs;