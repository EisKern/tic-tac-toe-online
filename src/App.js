import React from 'react';
import './App.css';
import Header from './Header';
import Game from './Game';

import { firebaseApp } from './config/firebase';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };
    }

    componentDidMount = () => {
        firebaseApp.auth().onAuthStateChanged(user => {
            this.setState({
                user: user
            });
        });
    }

    handleClickLogin = () => {
        firebaseApp.auth().signInAnonymously().catch(error => {
            console.log(`[error] Can not signin anonymouse (${error.code}:${error.message})`);
        });
    }

    handleClickLogout = () => {
        firebaseApp.auth().signOut();
    }

    render() {
        const login = this.state.user ? true : false;
        return (
            <div className="page" align="center">
                <Header
                    onClickLogin={() => this.handleClickLogin()}
                    onClickLogout={() => this.handleClickLogout()}
                    login={login}
                />
                <Game
                    login={login}
                />
            </div>
        );
    }
}

export default App;
