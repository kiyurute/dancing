import React from 'react';
import { BrowserRouter as Router , Route } from 'react-router-dom';

import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';
import Entrance from './components/Entrance/Entrance';
import Ready from './components/Ready/Ready';
import Game from './components/Game/Game'

const App=()=>(
    
       <Router>
        <Route path='/' exact component={Join} />
        <Route path='/chat' component={Chat} /> 
        <Route path='/entrance' component={Entrance} />
        <Route path='/ready' component={Ready} />
        <Route path='/game' component={Game} />
       </Router>
    
    )
    
export default App;
    
