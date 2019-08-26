import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import moment from 'moment';
import Board from './Board';
import Form from './Form';
import Result from './Result';

import { firebaseApp } from './config/firebase';

const firebaseDb = firebaseApp.database();

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roomId: "",
            id: "",
            sync: {
                board: Array(9).fill(-1),
                host: "",
                guest: "",
                turn: -1,
                judgement: -1,
                timestamp: null,
            }
        };
    }

    initGame = () => {
        this.setState({
            roomId: "",
            id: "",
            sync: {
                board: Array(9).fill(-1),
                host: "",
                guest: "",
                turn: -1,
                judgement: -1,
                timestamp: null,
            }
        });
    }

    handleClickBoardButton = async (i) => {
        if(this.state.sync.turn !== this.state.id || this.state.sync.board[i] !== -1) {
            return;
        }
        this.updateDatabase(i);
        console.log("click button");
    }

    updateDatabase = async (clickedNum) => {
        const copyBoard = this.state.sync.board.slice();
        const date = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");

        copyBoard[clickedNum] = this.state.id;
        const winner = this.judgeWinner(copyBoard);
        const canPut = copyBoard.indexOf(-1) === -1 ? false : true;
        const nextTurn = winner === -1 && canPut ? (this.state.sync.turn + 1) % 2 : -2;

        const ref = firebaseDb.ref("/games/" + this.state.roomId);
        await ref.update({
            board: copyBoard,
            turn: nextTurn,
            judgement: winner === -1 && !canPut ? 2 : winner,
            timestamp: date
        });
    }

    handleChangeRoom = (text) => {
        this.setState({
            roomId: text
        });
    }

    handlePlayButton = async () => {
        const gameRef = firebaseDb.ref("/games/" + this.state.roomId);
        const snapshot = await gameRef.once("value");
        const existRoom = snapshot.val() == null ? false : true;

        if(existRoom) {
            const roomTurn = snapshot.val().turn;
            if(roomTurn === -2) {
                this.createRoom(gameRef);
            } else if(roomTurn === -1) {
                this.enterRoom(gameRef);
            } else {
                console.log("error: room already full");
                return;
            }
        } else {
            this.createRoom(gameRef);
        }

        this.syncWithDatabase(gameRef);
        console.log("play in room " + this.state.roomId);
    }

    // Enter Existing Room as Guest
    enterRoom = async (ref) => {
        this.setState({
            id: 1
        });
        const guest = String(Math.random()).substr(2, 6);
        const turn = Math.round(Math.random());
        const date = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");

        await ref.update({
            guest: guest,
            turn: turn,
            timestamp: date
        });

        console.log("enter room");
    }

    // Create New Room as Host
    createRoom = async (ref) => {
        const host = String(Math.random()).substr(2, 6);
        const date = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
        this.setState({
            id: 0,
            sync: {
                board: Array(9).fill(-1),
                turn: -1,
                judgement: -1
            }
        });

        await ref.set(this.state.sync);
        await ref.update({
            host: host,
            timestamp: date
        });
        console.log("create room");
    }

    resetRoom = async (ref) => {
        const host = String(Math.random()).substr(2, 6);
        const date = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");

        await ref.update({
            board: Array(9).fill(-1),
            host: host,
            turn: -1,
            judgement: -1,
            timestamp: date
        });
        console.log("reset room");
    }

    syncWithDatabase = async (gameRef) => {
        await gameRef.on('value', snapshot => {
            const progress = snapshot.val();
            const { board, host, guest, turn, judgement, timestamp} = progress;
            const sync = this.state.sync;
            if(turn === -2 && judgement !== -1) {
                this.offCallback(gameRef);
            }
            this.setState({
                sync: {
                    ...sync,
                    board: board,
                    host: host,
                    guest: guest,
                    turn: turn,
                    judgement: judgement,
                    timestamp: timestamp
                }
            });
        });
    }

    offCallback = async (ref) => {
        await ref.off();
    }

    judgeWinner = (board) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for(let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] !== -1 && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return -1;
    }

    handleClickResetButton = () => {
        const gameRef = firebaseDb.ref("/games/" + this.state.roomId);
        this.offCallback(gameRef);
        const roomId = this.state.roomId;
        this.initGame();
        this.setState({
            roomId: roomId,
            id: 0
        });
        console.log(this.state);

        this.resetRoom(gameRef);
        this.syncWithDatabase(gameRef);
        console.log("reset room " + this.state.roomId);
    }

    handleClickEndButton = () => {
        const roomId = this.state.roomId;
        const gameRef = firebaseDb.ref("/games/" + this.state.roomId);
        gameRef.remove();
        this.initGame();
        this.setState({
            roomId: roomId
        });
        console.log("end game");
    }

    render() {
        const turn = this.state.sync.turn;
        const judgement = this.state.sync.judgement;
        const id = this.state.id;
        const message = judgement === -1 ? "" : judgement === id ? "You Win!" : judgement === 2 ? "Draw!" : "You Lose!";
        const gameEnd = turn === -2 ? true : false;

        return (
            <React.Fragment>
                <CssBaseline />
                <Container fixed align="center">
                    <Form
                        inGame={turn >= 0 ? true : false}
                        onChange={(text) => this.handleChangeRoom(text)}
                        onClick={()=>this.handlePlayButton()}
                    />
                    <Info
                        roomId={this.state.roomId}
                        color={this.state.id === 0 ? "red" : "blue"}
                        turn={turn === 0 ? "red" : "blue"}
                    />
                    <Board
                        board={this.state.sync.board}
                        onClick={(i) => this.handleClickBoardButton(i)}
                    />
                    <Result
                        message={message}
                        gameEnd={gameEnd}
                        id={id}
                        onResetClick={() => this.handleClickResetButton()}
                        onEndClick={() => this.handleClickEndButton()}
                    />
                </Container>
            </React.Fragment>
        );
    }
}


class Info extends React.Component {
    render() {
        const style = {
            border: "1px solid #999",
            fontWeight: "bold",
            lineHeight: 20,
            height: 20,
            margin: 1,
            padding: 0,
            width: 20,
        };
        return (
            <div className="info" align="center">
                <Typography variant="h6" component="h2" className="roomId" align="center">
                    Room ID: {this.props.roomId}
                </Typography>
                <div>
                    <Typography variant="h6" component="h2" className="myColor" align="center">
                        Your Color:
                        <button
                            className="yourColor"
                            style={Object.assign({background: this.props.color === "red" ? '#f99' : '#99f'}, style)}
                        ></button>
                    </Typography>
                </div>
                <div>
                    <Typography variant="h6" component="h2" className="turnColor" align="center">
                        Turn:
                        <button
                            className="turnColor"
                            style={Object.assign({background: this.props.turn === "red" ? '#f99' : '#99f'}, style)}
                        ></button>
                    </Typography>
                </div>
            </div>
        );
    }
}

export default Game;
