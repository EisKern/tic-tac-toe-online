import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';

import './Form.css';

export default class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: true
        };
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    handleTextChange(event) {
        const text = event.target.value;
        if(text.length === 4 && !isNaN(text)) {
            this.setState({
                buttonDisabled: false
            });
            this.props.onChange(text);
        } else {
            this.setState({
                buttonDisabled: true
            });
        }
    }

    render() {
        return (
            <div className="form">
                <FormControl
                    className="formText"
                    disabled={!this.props.login}
                >
                    <InputLabel htmlFor="component-simple">Room ID</InputLabel>
                    <Input id="component-simple" value={this.state.name} type="number" onChange={this.handleTextChange} />
                    <FormHelperText id="component-helper-text">4 digits</FormHelperText>
                </FormControl>
                <Button
                    className="formButton"
                    disabled={this.state.buttonDisabled || this.props.inGame}
                    variant="outlined"
                    onClick={this.props.onClick}
                >PLAY</Button>
            </div>
        );
    }
}
