import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default class Result extends React.Component {
    render() {
        const gameEnd =this.props.gameEnd;
        const isHost = this.props.id === 0 ? true : false;
        return (
            <div className="result">
                {gameEnd &&
                    <Typography variant="h6" component="h2" className="resultMessage" align="center">
                        {this.props.message}
                    </Typography>
                }
                {gameEnd && isHost &&
                    <div>
                        <Button
                            variant="outlined"
                            className="resetButton"
                            onClick={this.props.onResetClick}
                        >RESET</Button>
                        <Button
                            variant="outlined"
                            className="endButton"
                            onClick={this.props.onEndClick}
                        >END</Button>
                    </div>
                }
            </div>
        );
    }
}
