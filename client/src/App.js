import React from 'react';
import { BrowserRouter as Router , Route } from 'react-router-dom';

import Entrance from './components/Entrance/Entrance';
import Ready from './components/Ready/Ready';
import Game from './components/Game/Game'

const App=()=>(
    
       <Router>
        <Route path='/' exact component={Entrance} />
        <Route path='/entrance' component={Entrance} />
        <Route path='/ready' component={Ready} />
        <Route path='/game' component={Game} />
       </Router>
    
    )
    
export default App;
    
