import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

export default function SimpleAppBar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
        <AppBar position="static" color="primary">
            <Toolbar>
            <Typography variant="h5" color="inherit">
                Tic Tac Toe
            </Typography>
            </Toolbar>
        </AppBar>
        </div>
    );
}
