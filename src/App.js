import React from 'react';
import './App.css';
import Header from './Header';
import Game from './Game';

class App extends React.Component {
    render() {
        return (
            <div className="page" align="center">
                <Header />
                <Game />
            </div>
        );
    }
}

export default App;
