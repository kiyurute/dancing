import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import Backs from './Backs';
import MyCards from './MyCards';
import Modal from './Modal/Modal';

import backside from './cards/backside.svg';

import './style.css';

import AllCards from './AllCards';

import FooterLogo from './logo/footerLogo.svg';

let socket;

const Game = ({location}) => {
    
    const [userName,setUserName] = useState('');
    const [roomName,setRoomName] = useState('');
    const [builder,setBuilder] = useState('');
    const [members,setMembers] = useState([]);
    const [gameState,setGameState] = useState('ready');
    const [loadMember,setLoadMember] = useState('off');
    const [memberData,setMemberData] = useState([]);    //他人のカードの配列
    const [myCards,setMyCards] = useState();
    //const ENDPOINT='https://e0f956dc573149fcb26e0a1aecf31d9e.vfs.cloud9.ap-northeast-1.amazonaws.com:8081';
    const ENDPOINT='localhost:8081';
    const [turnNum,setTurnNum] = useState(1);
    // const [turnState, setTurnState] = useState();
    const [modal,setModal] = useState();
    const [message,setMessage] = useState([]);
    const [turnState,setTurnState] = useState();
    const [planState,setPlanState] = useState([]);
    
    let myCardsArr = [];
    let membersArr = [];

    
    
    useEffect(()=>{
        const { userName,roomName,builder } = queryString.parse(location.search);
        setUserName(userName);
        setRoomName(roomName);
        setBuilder(builder);
        
        socket = io(ENDPOINT);
        
        socket.on('connect',()=>{
            socket.emit('gameStart',userName,roomName,builder);
        })
        
        
        socket.on('loadGame',(member,cards) => {
            
            console.log('cards & queryResults');
            console.log(cards);
            console.log(member);
            window.sessionStorage.removeItem(['planState1'])
            window.sessionStorage.removeItem(['planState2'])
            
            let backArr = [];
            
            membersArr = member;
            
            console.log('membersArr is');console.log(membersArr);
            
            member.map((players) => {
            if(players.userName === userName){
                console.log(cards.slice(players.id*4-4,players.id*4));
                myCardsArr = cards.slice(players.id*4-4,players.id*4);
            }
            
            })
            
            // member.map((val,i) => {
            //     backArr.push(<Backs name={val.userName} cards={cards} key={i}/>)
            // })
            
            setMemberData(<Backs cards={cards} members={member}/>);
            
            console.log(myCardsArr);
            
            let firstPlayer;
            
             setMyCards(<MyCards players={member} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} rumorFunc={rumorFunc} discovererFunc={discovererFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc}　planFunc={planFunc} criminalFunc={criminalFunc}/>)
            
            myCardsArr.map((val) => {
                if(val.cardName === 'discoverer'){
                    firstPlayer = member.find((players)=>{
                            return (players.userName === userName);
                    })
                    
                    setModal(<Modal>あなたの番です。「第一発見者」を出して下さい。</Modal>);
                    setTurnState(userName);
                }
            })
            
            console.log(turnState);
            
            socket.emit('loadComp',userName,roomName,builder,turnState);
            
        })
        
        const alibiFunc = (cardID) => {
            console.log(cardID);
            socket.emit('alibi',cardID,userName);
        }
        
        
        socket.on('alibiComp',(cards,alibiName) => {
            membersArr.map((players) => {
                    if(players.userName === userName){
                     myCardsArr = cards.slice(players.id*4-4,players.id*4);
                     }
            
                })


            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc}　planFunc={planFunc} criminalFunc={criminalFunc}/>)
            setTurnNum(turnNum + 1);
            setMessage([...message,alibiName+'がアリバイを使用しました。']);
            setMemberData(<Backs cards={cards} members={membersArr}/>);

            let alibiID;

            membersArr.map((players) => {
                if(players.userName === alibiName){
                 alibiID = players.id
                 }
        
            })

            switch(alibiID){
                case 1:
                    setTurnState(membersArr[1].userName);
                    break;
                case 2:
                    setTurnState(membersArr[2].userName);
                    break;
                case 3:
                    setTurnState(membersArr[0].userName);
                    break;
            }

        })
        
        
        
        const rumorFunc = (cardID) => {
            console.log('rumor');
            socket.emit('rumor',cardID,userName);
        }
        
        socket.on('rumorComp',(cards,first,second,third,rumorPlayer) => {
            membersArr.map((players) => {
                    if(players.userName === userName){
                     myCardsArr = cards.slice(players.id*4-4,players.id*4);
                     }
            
                })
                setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc}　planFunc={planFunc} criminalFunc={criminalFunc}/>)
                setTurnNum(turnNum + 1);
                
                console.log(first);
                console.log(second);
                console.log(third);
                
                console.log(membersArr)
                
                membersArr.map((players) => {
                    let rumorResults = [<p key={0}>{rumorPlayer}が噂を使いました。</p>];
                    if(players.userName === userName){
                        console.log(players.id);
                        
                            if(players.id === 1){
                                console.log('case1');
                                rumorResults.push(<p key={1}>{membersArr[1].userName}から{translate(second.cardName)}をもらいました。{membersArr[2].userName}に{translate(first.cardName)}を渡しました。</p>);
                                console.log(rumorResults);
                                let newMessage = [...message,rumorResults];
                                setMessage(newMessage);
                            }else if(players.id === 2){
                                console.log('case2');
                                rumorResults.push(<p key={1}>{membersArr[2].userName}から{translate(third.cardName)}をもらいました。{membersArr[0].userName}に{translate(second.cardName)}を渡しました。</p>);
                                console.log(rumorResults);
                                let newMessage = [...message,rumorResults];
                                setMessage(newMessage);
                            }else if(players.id === 3){
                                console.log('case3');
                                rumorResults.push(<p key={1}>{membersArr[0].userName}から{translate(first.cardName)}をもらいました。{membersArr[1].userName}に{translate(third.cardName)}を渡しました。</p>);
                                console.log(rumorResults);
                                let newMessage = [...message,rumorResults];
                                setMessage(newMessage);
                            } 
                            
                        
                    }
                })
                
            setMemberData(<Backs cards={cards} members={membersArr}/>); 

            let rumorID;

            membersArr.map((players) => {
                if(players.userName === rumorPlayer){
                 rumorID = players.id
                 }
        
            })

            switch(rumorID){
                case 1:
                    setTurnState(membersArr[1].userName);
                    break;
                case 2:
                    setTurnState(membersArr[2].userName);
                    break;
                case 3:
                    setTurnState(membersArr[0].userName);
                    break;
            }
                
        })
        
        const discovererFunc = (cardID) => {
                console.log(cardID);
                socket.emit('discoverer',userName);       
        }
            
        socket.on('discovererComp', (cards,discovererName) => {
            
                console.log('discovererComp');
                console.log(cards);
                
                membersArr.map((players) => {
                    if(players.userName === userName){
                     console.log(cards.slice(players.id*4-4,players.id*4));
                     myCardsArr = cards.slice(players.id*4-4,players.id*4);
                     }
            
                })

                let discovererID;

                membersArr.map((player) => {
                    if(player.userName === discovererName){
                        discovererID = player.id;
                    }
                })

                
                console.log(myCardsArr);
                setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc}　planFunc={planFunc} criminalFunc={criminalFunc}/>)
                setTurnNum(turnNum + 1);
                console.log(turnNum);
                console.log(discovererID);
                
                setMessage([...message,discovererName+'が第一発見者です']);
                setMemberData(<Backs cards={cards} members={membersArr}/>);

                switch(discovererID){
                    case 1:
                        setTurnState(membersArr[1].userName);
                        break;
                    case 2:
                        setTurnState(membersArr[2].userName);
                        break;
                    case 3:
                        setTurnState(membersArr[0].userName);
                        break;
                }

                console.log(turnState);

                
            })
            
            
        const dealingFunc = (cardID) => {
            console.log('in dealingFunc');
            console.log(userName);
            let playerChoices = [<p key={0}>以下から交換する相手を選択してください</p>];
            membersArr.map((member,i) => {
                if(member.userName === userName){
                    
                }else{
                playerChoices.push(
                    <p key={i+1} style={{cursor:'pointer'}} onClick={() => {showCard(member.userName)}}>{member.userName}</p>
                    )
                }
            })
            console.log(playerChoices);
            setMessage(...message,playerChoices);
            
            const showCard = (memberName) => {
                let cardChoices = [<p key={0}>以下から交換するカードを選択してください</p>]
                let dealingCounter = 0;
                myCardsArr.map((card,i) => {
                    if(card.cardName === 'empty'){
                        //not add
                    }else if(card.cardName === 'dealing' && dealingCounter === 0){
                        //not add
                        dealingCounter += 1;
                    }else if(card.cardName === 'dealing' && dealingCounter >= 1){
                        cardChoices.push(
                        <p key={i+1} style={{cursor:'pointer'}} onClick={() => {sendDealing(memberName,card.cardName)}}>{translate(card.cardName)}</p>
                        )
                    }else{
                        cardChoices.push(
                        <p key={i+1} style={{cursor:'pointer'}} onClick={() => {sendDealing(memberName,card.cardName)}}>{translate(card.cardName)}</p>
                        )
                    }
                })
                console.log(cardChoices);
                console.log(memberName);
                setMessage(...message,cardChoices);
            }
            
            const sendDealing = (playerName,cardName) => {
                console.log(playerName,cardName);
                socket.emit('dealing',userName,playerName,cardName,cardID);
                setMessage([...message,<p key={0}>相手のカード選択を待っています...</p>]);
            }
        }
        
        socket.on('dealingOpponent',(originPlayer,originCard,opponentPlayer,cardID) => {
            if(userName === opponentPlayer){
                console.log('you are selected');
                let cardChoices = [<p key={0}>あなたが取引相手に選ばれました。以下から交換するカードを選択してください</p>]
                let dealingCounter = 0;
                myCardsArr.map((card,i) => {
                    if(card.cardName === 'empty'){
                        //not add
                    }else{
                        cardChoices.push(
                        <p key={i+1} style={{cursor:'pointer'}} onClick={() => {sendOpponentCard(card.cardName)}}>{translate(card.cardName)}</p>
                        )
                    }
                })
                setMessage(...message,cardChoices);
            }
            
            const sendOpponentCard = (opponentCard) => {
                socket.emit('dealingOpponentComp',originPlayer,originCard,opponentPlayer,opponentCard,cardID);
            }
        }
        )
        
        socket.on('dealingComp',(cards,originPlayer,opponentPlayer) => {
            membersArr.map((players) => {
                    if(players.userName === userName){
                     myCardsArr = cards.slice(players.id*4-4,players.id*4);
                     }
                })
                
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc} planFunc={planFunc} criminalFunc={criminalFunc}/>)
            setTurnNum(turnNum + 1);
            setMessage([...message,<p key={0}>{originPlayer}が{opponentPlayer}と取引をしました。</p>]);
            setMemberData(<Backs cards={cards} members={membersArr}/>);

            let dealingID;

            membersArr.map((players) => {
                if(players.userName === originPlayer){
                 dealingID = players.id
                 }
        
            })

            switch(dealingID){
                case 1:
                    setTurnState(membersArr[1].userName);
                    break;
                case 2:
                    setTurnState(membersArr[2].userName);
                    break;
                case 3:
                    setTurnState(membersArr[0].userName);
                    break;
            }
            
        })
        
        const manipulationFunc = (cardID) =>{
            console.log('manipulationFunc');
            socket.emit('manipulationKick',cardID,userName);
        }
        
        socket.on('manipulationChoice',(cards,manipulationName) => {
            membersArr.map((players) => {
                    if(players.userName === userName){
                     myCardsArr = cards.slice(players.id*4-4,players.id*4);
                     }
                })
               
            let manipulationPartner;
            
            membersArr.map((players) => {
                    if(players.userName === userName){
                        if(players.id === 1){
                            manipulationPartner = membersArr[2].userName
                        }else{
                            manipulationPartner = membersArr[players.id-2].userName
                        }
                    }
            }) 
            
            let manipulationMessage = [<p key={0}>{manipulationName}が情報操作を使いました。{manipulationPartner}に渡すカードを選択してください。</p>];
            
            myCardsArr.map((card,i) => {
                if(card.cardName === 'empty'){
                    
                }else{
                manipulationMessage.push(
                    <p key={i+1} style={{cursor:'pointer'}} onClick={() => {manipulationSelected(card.id)}}>{translate(card.cardName)}</p>
                    )
                }
            })
            
            const manipulationSelected = (cardID) => {
                console.log(cardID);
                
                let memberID;
                membersArr.map((memberData) => {
                    if(memberData.userName === userName){
                        memberID = memberData.id;
                    }
                })
                
                console.log(memberID);
                socket.emit('manipulationSelected',cardID,userName,memberID,manipulationName);
                setMessage([...message,<p>他のプレイヤーを待っています。</p>])
            }
                
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc} planFunc={planFunc} criminalFunc={criminalFunc}/>)
            setTurnNum(turnNum + 1);
            setMessage([...message,manipulationMessage]);
            setMemberData(<Backs cards={cards} members={membersArr}/>);
        })
        
        
        
        socket.on('manipulationComp',(cards,manipulationCardsName,manipulationPlayer) => {

            console.log(manipulationCardsName);

            membersArr.map((players) => {
                    if(players.userName === userName){
                     myCardsArr = cards.slice(players.id*4-4,players.id*4);
                     }
                })
                
            let manipulationMessage = [<p key={0}>情報操作が完了しました。</p>]
            
            membersArr.map((players) => {
                    if(players.userName === userName){
                        if(players.id === 1){
                            manipulationMessage.push(<p key={1}>{membersArr[2].userName}に{translate(manipulationCardsName[0])}を渡しました。</p>)
                            manipulationMessage.push(<p key={2}>{membersArr[1].userName}から{translate(manipulationCardsName[1])}を受け取りました。</p>)
                        }else if(players.id === 2){
                            manipulationMessage.push(<p key={1}>{membersArr[0].userName}に{translate(manipulationCardsName[1])}を渡しました。</p>)
                            manipulationMessage.push(<p key={2}>{membersArr[2].userName}から{translate(manipulationCardsName[2])}を受け取りました。</p>)
                        }else{
                            manipulationMessage.push(<p key={1}>{membersArr[1].userName}に{translate(manipulationCardsName[2])}を渡しました。</p>)
                            manipulationMessage.push(<p key={2}>{membersArr[0].userName}から{translate(manipulationCardsName[0])}を受け取りました。</p>)
                        }
                    }
            })

                
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc} planFunc={planFunc} criminalFunc={criminalFunc}/>)
            setTurnNum(turnNum + 1);
            setMessage([...message,manipulationMessage]);
            setMemberData(<Backs cards={cards} members={membersArr}/>);

            let manipulationID;

            membersArr.map((players) => {
                if(players.userName === manipulationPlayer){
                 manipulationID = players.id
                 }
        
            })

            switch(manipulationID){
                case 1:
                    setTurnState(membersArr[1].userName);
                    break;
                case 2:
                    setTurnState(membersArr[2].userName);
                    break;
                case 3:
                    setTurnState(membersArr[0].userName);
                    break;
            }
        })
        
        const dogFunc = (cardID) => {
            socket.emit('dog',cardID);
        }
        
        socket.on('dogGetAllCards',(cards,cardID) => {
            let dogCardsArr = [];
            let dogMembersArr = [];
            
            membersArr.map((players) => {
                    if(players.userName === userName){
                     myCardsArr = cards.slice(players.id*4-4,players.id*4);
                     }
                })
            
            cards.map((card) => {
                if(card.id === myCardsArr[0].id){
                    card.cardName = 'empty';
                    dogCardsArr.push(card);
                }else if(card.id === myCardsArr[1].id){
                    card.cardName = 'empty';
                    dogCardsArr.push(card);
                }else if(card.id === myCardsArr[2].id){
                    card.cardName = 'empty';
                    dogCardsArr.push(card);
                }else if(card.id === myCardsArr[3].id){
                    card.cardName = 'empty';
                    dogCardsArr.push(card);
                }else{
                    dogCardsArr.push(card);
                }
            })

            let dogFirstCardsSet = dogCardsArr.slice(0,4);
            let dogSecondCardsSet = dogCardsArr.slice(4,8);
            let dogThirdCardsSet = dogCardsArr.slice(8,12);

            let dogFirstCardsSetMessage = [];
            let dogSecondCardsSetMessage = [];
            let dogThirdCardsSetMessage = [];
            
            let dogMessage = [<p>以下から一枚選択してください。</p>];

            if(membersArr[0].userName === userName){
                dogSecondCardsSetMessage.push(<p>{membersArr[1].userName}</p>);
                dogThirdCardsSetMessage.push(<p>{membersArr[2].userName}</p>);
            }else if(membersArr[1].userName === userName){
                dogFirstCardsSetMessage.push(<p>{membersArr[0].userName}</p>);
                dogThirdCardsSetMessage.push(<p>{membersArr[1].userName}</p>);
            }else if(membersArr[2].userName === userName){
                dogFirstCardsSetMessage.push(<p>{membersArr[0].userName}</p>);
                dogSecondCardsSetMessage.push(<p>{membersArr[1].userName}</p>);
            }

            dogFirstCardsSet.map((card,i) => {
                if(card.cardName !== 'empty'){
                    dogFirstCardsSetMessage.push(
                        <div className="col-2" key={i}>
                        <img src={backside} className='w-100' style={{cursor:'pointer'}} onClick={() => {sendingDogSelect(i,membersArr[0].id)}} />
                        </div>
                    )
                }else{}
            })

            dogSecondCardsSet.map((card,i) => {
                if(card.cardName !== 'empty'){
                    dogSecondCardsSetMessage.push(
                        <div className="col-2" key={i}>
                        <img src={backside} className='w-100' style={{cursor:'pointer'}} onClick={() => {sendingDogSelect(i,membersArr[1].id)}} />
                        </div>
                    )
                }else{}
            })

            dogThirdCardsSet.map((card,i) => {
                if(card.cardName !== 'empty'){
                    dogThirdCardsSetMessage.push(
                        <div className="col-2" key={i}>
                        <img src={backside} className='w-100' style={{cursor:'pointer'}} onClick={() => {sendingDogSelect(i,membersArr[2].id)}} />
                        </div>
                    )
                }else{}
            })

            const sendingDogSelect = (selectedCard,selectedPlayer) => {
                socket.emit('dogSelect',selectedCard,selectedPlayer,cardID,userName);

            }
            
            setMessage([...message,dogMessage,<div className="row">{dogFirstCardsSetMessage}</div>,<div className="row">{dogSecondCardsSetMessage}</div>,<div className="row">{dogThirdCardsSetMessage}</div>])
        })

        socket.on('dogComp',(results,selectedPlayer,dogUserName,cards) => {
            console.log(results);
            console.log(userName);
            let selectedPlayerName;

            membersArr.map((player) => {
                if(player.id === selectedPlayer){
                    selectedPlayerName = player.userName;
                }
            })

            let dogCompMessage = [<p key={0}>{dogUserName}が犬を使いました。{selectedPlayerName}が{translate(results[0].cardName)}を持っていました。</p>]

            membersArr.map((players) => {
                if(players.userName === userName){
                 myCardsArr = cards.slice(players.id*4-4,players.id*4);
                 }
            })

            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc} planFunc={planFunc} criminalFunc={criminalFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);
            setMessage([...message,dogCompMessage]);

            let dogID;

            membersArr.map((players) => {
                if(players.userName === dogUserName){
                 dogID = players.id
                 }
        
            })

            switch(dogID){
                case 1:
                    setTurnState(membersArr[1].userName);
                    break;
                case 2:
                    setTurnState(membersArr[2].userName);
                    break;
                case 3:
                    setTurnState(membersArr[0].userName);
                    break;
            }
        })

        const witnessFunc = (cardID) => {
            console.log(cardID);
            let witnessMessage = [<p key={0}>以下から手札を見る相手を選択してください</p>];
            membersArr.map((player) => {
                if(player.userName !== userName){
                    witnessMessage.push(<p style={{cursor:'pointer'}} onClick={() => {witnessSelect(player.id,cardID)}}>{player.userName}</p>);
                }
            })
            setMessage([...message,witnessMessage])
        }

        const witnessSelect = (selectedPlayer,cardID) => {
            socket.emit('witnessSelect',selectedPlayer,cardID,userName)
        }

        socket.on('witnessCompSelf',(selectedPlayer,witnessPlayerName,cards) => {
            console.log(selectedPlayer,witnessPlayerName);
            let selectedPlayersCards;
            let selectedPlayersCardsNoEmpty = [];
            let selectedPlayerName;
            membersArr.map((player) => {
                if(player.id === selectedPlayer){
                    selectedPlayerName = player.userName;
                }
            })

            switch(selectedPlayer){
                case 1:
                    selectedPlayersCards = cards.slice(0,4);
                    break;
                case 2:
                    selectedPlayersCards = cards.slice(4,8);
                    break;
                case 3:
                    selectedPlayersCards = cards.slice(8,12)
                    break;
            }
            console.log(selectedPlayersCards);

            selectedPlayersCards.map((card) => {
                if(card.cardName === 'empty'){

                }else{
                    selectedPlayersCardsNoEmpty.push(translate(card.cardName)+',');
                }
            })

            let witnessCompSelfMessage = (<p key={1}>{selectedPlayersCardsNoEmpty}</p>);

            membersArr.map((players) => {
                if(players.userName === userName){
                 myCardsArr = cards.slice(players.id*4-4,players.id*4);
                 }
            })

            setMessage([...message,<p key={0}>{selectedPlayerName}は以下のカードを持っています。</p>,witnessCompSelfMessage]);
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc} planFunc={planFunc} criminalFunc={criminalFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);

            let witnessID;

            membersArr.map((players) => {
                if(players.userName === witnessPlayerName){
                 witnessID = players.id
                 }
        
            })

            switch(witnessID){
                case 1:
                    setTurnState(membersArr[1].userName);
                    break;
                case 2:
                    setTurnState(membersArr[2].userName);
                    break;
                case 3:
                    setTurnState(membersArr[0].userName);
                    break;
            }

        })

        socket.on('witnessCompOther',(selectedPlayer,wintessPlayerName,cards) => {
            let selectedPlayerName;
            membersArr.map((player) => {
                if(player.id === selectedPlayer){
                    selectedPlayerName = player.userName;
                }
            })
            let witnessCompMessage = (<p key={0}>{wintessPlayerName}が目撃者を使用し、{selectedPlayerName}の手札を全て知りました。</p>)

            membersArr.map((players) => {
                if(players.userName === userName){
                 myCardsArr = cards.slice(players.id*4-4,players.id*4);
                 }
            })

            setMessage({...message,witnessCompMessage});
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc} planFunc={planFunc} criminalFunc={criminalFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);

            let witnessID;

            membersArr.map((players) => {
                if(players.userName === wintessPlayerName){
                 witnessID = players.id
                 }
        
            })

            switch(witnessID){
                case 1:
                    setTurnState(membersArr[1].userName);
                    break;
                case 2:
                    setTurnState(membersArr[2].userName);
                    break;
                case 3:
                    setTurnState(membersArr[0].userName);
                    break;
            }

        })

        const normalFunc = (cardID) => {
            socket.emit('normal',cardID,userName)
        }

        socket.on('normalComp',(cards,normalPlayerName) => {
            let normalMessage = (<p key={0}>{normalPlayerName}が一般人を使いました。</p>)

            membersArr.map((players) => {
                if(players.userName === userName){
                 myCardsArr = cards.slice(players.id*4-4,players.id*4);
                 }
            })

            setMessage([...message,normalMessage]);
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc} planFunc={planFunc} criminalFunc={criminalFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);

            let normalID;

            membersArr.map((players) => {
                if(players.userName === normalPlayerName){
                 normalID = players.id
                 }
        
            })

            switch(normalID){
                case 1:
                    setTurnState(membersArr[1].userName);
                    break;
                case 2:
                    setTurnState(membersArr[2].userName);
                    break;
                case 3:
                    setTurnState(membersArr[0].userName);
                    break;
            }

            console.log('planState1 is')
            console.log(window.sessionStorage.getItem(['planState1']));
            console.log('planState2 is')
            console.log(window.sessionStorage.getItem(['planState2']));
        })

        const boyFunc = (cardID) => {
            socket.emit('boy',cardID,userName);
        }

        socket.on('boyCompSelf',(cards,boyPlayerName) => {
            let  criminalOwner;
            cards.map((card) => {
                if(card.cardName === 'criminal'){
                    if(card.id >= 1 && card.id <= 4){
                        criminalOwner = membersArr[0].userName;
                    }else if(card.id >= 5 && card.id <= 8){
                        criminalOwner = membersArr[1].userName;
                    }else{
                        criminalOwner = membersArr[2].userName;
                    }
                    
                }
            })

            console.log(criminalOwner);

            membersArr.map((players) => {
                if(players.userName === userName){
                 myCardsArr = cards.slice(players.id*4-4,players.id*4);
                 }
            })

            setMessage([...message,<p>{criminalOwner}が「犯人」を持っています。</p>]);
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc} planFunc={planFunc} criminalFunc={criminalFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);

            let boyID;

            membersArr.map((players) => {
                if(players.userName === boyPlayerName){
                 boyID = players.id
                 }
        
            })

            switch(boyID){
                case 1:
                    setTurnState(membersArr[1].userName);
                    break;
                case 2:
                    setTurnState(membersArr[2].userName);
                    break;
                case 3:
                    setTurnState(membersArr[0].userName);
                    break;
            }
        })

        socket.on('boyCompOther',(cards,boyPlayerName) => {

            membersArr.map((players) => {
                if(players.userName === userName){
                 myCardsArr = cards.slice(players.id*4-4,players.id*4);
                 }
            })

            setMessage([...message,<p key={0}>{boyPlayerName}が「少年」を使い、「犯人」の持ち主を知りました。</p>]);
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc} planFunc={planFunc} criminalFunc={criminalFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);

            let boyID;

            membersArr.map((players) => {
                if(players.userName === boyPlayerName){
                 boyID = players.id
                 }
        
            })

            switch(boyID){
                case 1:
                    setTurnState(membersArr[1].userName);
                    break;
                case 2:
                    setTurnState(membersArr[2].userName);
                    break;
                case 3:
                    setTurnState(membersArr[0].userName);
                    break;
            }

        })

        const detectiveFunc = (cardID) => {
            let detectiveMessage = [<p>「犯人」を持っている人を以下から選択</p>]
            membersArr.map((player,i) => {
                if(player.userName !== userName){
                    detectiveMessage.push(<p key={i} style={{cursor:'pointer'}} onClick={() => {detectiveSelect(player.id)}}>{player.userName}</p>)
                }
            })

            const detectiveSelect = (selectedPlayerID) => {
                socket.emit('detective',cardID,selectedPlayerID,userName)
            }

            setMessage([...message,detectiveMessage]);
        }

        socket.on('detectiveSuccess',(detectivePlayerName,criminalID) => {
            console.log('winner:'+detectivePlayerName)
        })

        socket.on('detectiveMiss',(detectivePlayerName,selectedPlayerID,cards) => {
            console.log('detectiveMiss')
            membersArr.map((players) => {
                if(players.userName === userName){
                 myCardsArr = cards.slice(players.id*4-4,players.id*4);
                 }
            })

            let selectedPlayer = membersArr.find((v) => v.id === selectedPlayerID);
            let selectedPlayerName = selectedPlayer.userName;
            
            setMessage([...message,<p key={0}>{detectivePlayerName}が「探偵」を使い、{selectedPlayerName}を犯人だと疑いましたが、失敗しました。</p>]);
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc} planFunc={planFunc} criminalFunc={criminalFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);

            let detectiveID;

            membersArr.map((players) => {
                if(players.userName === detectivePlayerName){
                 detectiveID = players.id
                 }
        
            })

            switch(detectiveID){
                case 1:
                    setTurnState(membersArr[1].userName);
                    break;
                case 2:
                    setTurnState(membersArr[2].userName);
                    break;
                case 3:
                    setTurnState(membersArr[0].userName);
                    break;
            }
        })

        const planFunc = (cardID) => {
            socket.emit('plan',cardID,userName)
        }

        socket.on('planComp',(cards,planPlayerName) => {

            if(sessionStorage.getItem(['planState1']) === null && sessionStorage.getItem(['planState2']) === null){
                window.sessionStorage.setItem(['planState1'],[planPlayerName])
            }else if(sessionStorage.getItem(['planState2']) === null){
                window.sessionStorage.setItem(['planState2'],[planPlayerName])
            }else{}

            setMessage([...message,<p key={0}>{planPlayerName}が「たくらみ」を使い、犯人の見方になりました。</p>]);
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc} detectiveFunc={detectiveFunc} planFunc={planFunc} criminalFunc={criminalFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);

            let planID;

            membersArr.map((players) => {
                if(players.userName === planPlayerName){
                 planID = players.id
                 }
        
            })

            switch(planID){
                case 1:
                    setTurnState(membersArr[1].userName);
                    break;
                case 2:
                    setTurnState(membersArr[2].userName);
                    break;
                case 3:
                    setTurnState(membersArr[0].userName);
                    break;
            }

            console.log('planState1 is')
            console.log(window.sessionStorage.getItem(['planState1']));
            console.log('planState2 is')
            console.log(window.sessionStorage.getItem(['planState2']));

        })

        const criminalFunc = (cardID) => {
            socket.emit('criminal',cardID,userName)
        }

        socket.on('criminalMiss',() => {
            console.log('criminalMIss');
        })

        socket.on('criminalSuccess',(criminalPlayerName) => {
            console.log('winner:'+criminalPlayerName)
        })
        
    },[])
    
    
    useEffect(() => {
        console.log(turnState);
    },[turnState])
    
    // let gameMessage = message.map((val,i) => {
    //     return (
    //             val
    //             )
    // })
    
    if(turnState === userName){

    return(
        <>
        {modal}
        <div className="container-fluid">
            <div className="row header">
                        <div className="col-12 p-0">
                            <p className="player-name">プレイヤー名：{userName}</p>
                        </div>
            </div>
            <div className="row">
                <div className="col-12 pt-3 pl-3 pr-3">
                    <div className="card p-3 shadow-sm">
                        <p>実況</p>
                        <div className='row pt-2 overflow-scroll' style={{height:'200px'}}>
                            {message.map((message) => {

                                return (
                                    <div>
                                        <p>{message}</p>
                                    </div>
                                )

                            })}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="row">
            
                <div className="col-md-6 pt-3 pl-3">
                    <div className="card p-3 shadow-sm">
                        <p>みんなのカード</p>
                        {memberData}
                    </div>
                </div>
                
                <div className="col-md-6 pt-3 pr-3">
                    <div className="card shadow-sm">
                        <div className="mycard-wrapper">
                            <div className="mycards p-3">
                                        <p>あなたのカード</p>
                                        {myCards}
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>


            <div className="row">
                    <div className="col-12 p-3">
                        <div className="card p-3 shadow-sm">
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
        </>
        )

    }else{
        //-------------------------------------------------------------------------------------------------------------------------
        return(
            <>
            {modal}
            
            <div className="container-fluid">
                <div className="row header">
                        <div className="col-12 p-0">
                            <p className="player-name">プレイヤー名：{userName}</p>
                        </div>
                </div>
                <div className='row'>
                    <div className='col-12 pt-3 pl-3 pr-3'>
                        <div className="card p-3 shadow-sm shadow-sm">
                            <p>実況</p>
                            <div className='row pt-2 overflow-scroll' style={{height:'200px'}}>
                            {message.map((message) => {

                                return (
                                    <div>
                                        <p>{message}</p>
                                    </div>
                                )
                                
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                
                    <div className="col-md-6 pt-3 pl-3">
                        <div className="card p-3 shadow-sm">
                            <p>みんなのカード</p>
                            {memberData}
                        </div>
                    </div>
                    
                    <div className="col-md-6 pt-3 pr-3">
                        <div className="card shadow-sm">
                            <div className="mycard-wrapper">
                                <div className="cardscover">
                                </div>
                                <div className="mycards p-3">
                                    <p>あなたのカード</p>
                                    {myCards}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>


                <div className="row">
                    <div className="col-12 p-3">
                        <div className="card p-3 shadow-sm">
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
            </>
            )
    
    }
}

const translate = (englishName) => {
    switch(englishName){
        case 'empty':
            return 'empty';
            break;
        case 'alibi':
            return '「アリバイ」';
            break;
        case 'boy':
            return '「少年」';
            break;
        case 'criminal':
            return '「犯人」'
            break;
        case 'dealing':
            return '「取引」'
            break;
        case 'detective':
            return '「探偵」'
            break;
        case 'discovere':
            return '「第一発見者」'
            break;
        case 'dog':
            return '「犬」'
            break;
        case 'manipulation':
            return '「情報操作」'
            break;
        case 'normal':
            return '「一般人」'
            break;
        case 'plan':
            return '「たくらみ」'
            break;
        case 'rumor':
            return '「噂」'
            break;
        case 'witness':
            return '「目撃者」'
            break;
    }
}

export default Game;