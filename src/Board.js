import React from 'react';
import './Board.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
        };
    }

    hoverOn = () => {
        this.setState({
            hover: true
        });
    }

    hoverOff = () => {
        this.setState({
            hover: false
        });
    }

    render() {
        const item = this.props.value === -1 ? null : this.props.value;
        const color = item === 0 ? '#f99' : item === 1 ? '#99f' : this.state.hover ? '#ddd' : '#fff';
        const style = {
            background: color
        };

        return (
            <button
                className="square"
                onClick={this.props.onClick}
                style={style}
                onMouseEnter={this.hoverOn}
                onMouseLeave={this.hoverOff}
            ></button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.board[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div className="board" align="center">
                <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                </div>
                <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
                </div>
                <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

export default Board;
