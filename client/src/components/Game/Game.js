import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

import Backs from './Backs';
import MyCards from './MyCards';
import Modal from './Modal/Modal';

import backside from './cards/backside.svg';

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
    const [turnState, setTurnState] = useState();
    const [modal,setModal] = useState();
    const [message,setMessage] = useState([]);
    
    let myCardsArr = [];
    let membersArr = []
    
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
            
             setMyCards(<MyCards players={member} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} rumorFunc={rumorFunc} discovererFunc={discovererFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc}/>)
            
            myCardsArr.map((val) => {
                if(val.cardName === 'discoverer'){
                    firstPlayer = member.find((players)=>{
                            return (players.userName === userName);
                    })
                    setTurnState(firstPlayer);
                    setModal(<Modal>あなたの番です</Modal>);
                }
            })
            
            
            
            socket.emit('loadComp',userName,roomName,builder);
            
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
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc}/>)
            setTurnNum(turnNum + 1);
            setMessage([...message,<p key={0}>{alibiName}がアリバイを使用しました。</p>]);
            setMemberData(<Backs cards={cards} members={membersArr}/>);
        })
        
        
        
        const rumorFunc = (cardID) => {
            console.log('rumor');
            socket.emit('rumor',cardID);
        }
        
        socket.on('rumorComp',(cards,first,second,third) => {
            membersArr.map((players) => {
                    if(players.userName === userName){
                     myCardsArr = cards.slice(players.id*4-4,players.id*4);
                     }
            
                })
                setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc}/>)
                setTurnNum(turnNum + 1);
                
                console.log(first);
                console.log(second);
                console.log(third);
                
                console.log(membersArr)
                
                membersArr.map((players) => {
                    let rumorResults;
                    if(players.userName === userName){
                        console.log(players.id);
                        
                            if(players.id === 1){
                                console.log('case1');
                                rumorResults = [membersArr[1].userName+'から'+second.cardName+'をもらいました。',membersArr[2].userName+'に'+first.cardName+'を渡しました。'];
                                console.log(rumorResults);
                                let newMessage = [...message,rumorResults];
                                setMessage(newMessage);
                            }else if(players.id === 2){
                                console.log('case2');
                                rumorResults = [membersArr[2].userName+'から'+third.cardName+'をもらいました。',membersArr[0].userName+'に'+second.cardName+'を渡しました。'];
                                console.log(rumorResults);
                                let newMessage = [...message,rumorResults];
                                setMessage(newMessage);
                            }else if(players.id === 3){
                                console.log('case3');
                                rumorResults = [membersArr[0].userName+'から'+first.cardName+'をもらいました。',membersArr[1].userName+'に'+third.cardName+'を渡しました。'];
                                console.log(rumorResults);
                                let newMessage = [...message,rumorResults];
                                setMessage(newMessage);
                            } 
                            
                        
                    }
                })
                
            setMemberData(<Backs cards={cards} members={membersArr}/>); 
                
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
                
                console.log(myCardsArr);
                setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc}/>)
                setTurnNum(turnNum + 1);
                console.log(turnNum);
                
                setMessage([...message,<p>{discovererName}が第一発見者です。</p>]);
                setMemberData(<Backs cards={cards} members={membersArr}/>);
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
                        <p key={i+1} style={{cursor:'pointer'}} onClick={() => {sendDealing(memberName,card.cardName)}}>{card.cardName}</p>
                        )
                    }else{
                        cardChoices.push(
                        <p key={i+1} style={{cursor:'pointer'}} onClick={() => {sendDealing(memberName,card.cardName)}}>{card.cardName}</p>
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
                        <p key={i+1} style={{cursor:'pointer'}} onClick={() => {sendOpponentCard(card.cardName)}}>{card.cardName}</p>
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
                
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc}/>)
            setTurnNum(turnNum + 1);
            setMessage([...message,<p key={0}>{originPlayer}が{opponentPlayer}と取引をしました。</p>]);
            setMemberData(<Backs cards={cards} members={membersArr}/>);
            
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
                    <p key={i+1} style={{cursor:'pointer'}} onClick={() => {manipulationSelected(card.id)}}>{card.cardName}</p>
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
                socket.emit('manipulationSelected',cardID,userName,memberID);
                setMessage([...message,<p>他のプレイヤーを待っています。</p>])
            }
                
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc}/>)
            setTurnNum(turnNum + 1);
            setMessage([...message,manipulationMessage]);
            setMemberData(<Backs cards={cards} members={membersArr}/>);
        })
        
        
        
        socket.on('manipulationComp',(cards) => {
            membersArr.map((players) => {
                    if(players.userName === userName){
                     myCardsArr = cards.slice(players.id*4-4,players.id*4);
                     }
                })
                
            let manipulationMessage = [<p key={0}>情報操作が完了しました。</p>]
            
            membersArr.map((players) => {
                    if(players.userName === userName){
                        if(players.id === 1){
                            manipulationMessage.push(<p key={1}>{membersArr[2].userName}に選んだカードを渡しました。</p>)
                        }else{
                            manipulationMessage.push(<p key={1}>{membersArr[players.id-2].userName}に選んだカードを渡しました。</p>)
                        }
                    }
            })

            membersArr.map((players) => {
                if(players.userName === userName){
                    if(players.id === 3){
                        manipulationMessage.push(<p key={1}>{membersArr[0].userName}からカードを受け取りました。</p>)
                    }else{
                        manipulationMessage.push(<p key={2}>{membersArr[players.id].userName}からカードを受け取りました。</p>)
                    }
                }
        })
                
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc}/>)
            setTurnNum(turnNum + 1);
            setMessage([...message,manipulationMessage]);
            setMemberData(<Backs cards={cards} members={membersArr}/>);
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

            let dogCompMessage = [<p key={0}>{dogUserName}が犬を使いました。{selectedPlayerName}が{results[0].cardName}を持っていました。</p>]

            membersArr.map((players) => {
                if(players.userName === userName){
                 myCardsArr = cards.slice(players.id*4-4,players.id*4);
                 }
            })

            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);
            setMessage([...message,dogCompMessage]);
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
                    selectedPlayersCardsNoEmpty.push(card.cardName+',');
                }
            })

            let witnessCompSelfMessage = (<p key={1}>{selectedPlayersCardsNoEmpty}</p>);

            membersArr.map((players) => {
                if(players.userName === userName){
                 myCardsArr = cards.slice(players.id*4-4,players.id*4);
                 }
            })

            setMessage([...message,<p key={0}>{selectedPlayerName}は以下のカードを持っています。</p>,witnessCompSelfMessage]);
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);

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

            setMessage([...message,witnessCompMessage]);
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);

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
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);
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
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);
        })

        socket.on('boyCompOther',(cards,boyPlayerName) => {

            membersArr.map((players) => {
                if(players.userName === userName){
                 myCardsArr = cards.slice(players.id*4-4,players.id*4);
                 }
            })

            setMessage([...message,<p key={0}>{boyPlayerName}が「少年」を使い、「犯人」の持ち主を知りました。</p>]);
            setMyCards(<MyCards players={memberData} myCards={myCardsArr} playerName={userName} alibiFunc={alibiFunc} discovererFunc={discovererFunc} rumorFunc={rumorFunc} dealingFunc={dealingFunc} manipulationFunc={manipulationFunc} dogFunc={dogFunc} witnessFunc={witnessFunc} normalFunc={normalFunc} boyFunc={boyFunc}/>)
            setTurnNum(turnNum + 1);
            setMemberData(<Backs cards={cards} members={membersArr}/>);
        })
        
    },[])
    
    
    useEffect(() => {
        console.log(turnState);
    },[turnState])
    
    let gameMessage = message.map((val,i) => {
        return (
                val
                )
    })
    
    
    return(
        <div className="container-fluid">
            <div className="card">
                <p>commentary</p>
                <div className='row pt-2 overflow-scroll' style={{height:'200px'}}>
                    {gameMessage}
                </div>
            </div>
            
            <div className="row">
            
                <div className="col-md-6">
                    <div className="card">
                        <p>ターン:<span>{turnNum}</span>/4</p>
                        {memberData}
                        {console.log('rendering')}
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="card">
                        <p>あなたのカード</p>
                        {myCards}
                    </div>
                </div>
                
            </div>
            
            
            {modal}
        </div>
        )
}

export default Game;