import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LoginDialog from './LoginDialog';
import LoginIcon from './MenuIcon';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function ButtonAppBar(props) {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleClickLogin() {
        setOpen(false);
        props.onClickLogin();
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5" className={classes.title}>
                        Tic Tac Toe
                    </Typography>
                    {!props.login ? (
                        <Button color="inherit" onClick={handleClickOpen}>Login</Button>
                    ) : (
                        <LoginIcon
                            onClickLogout={props.onClickLogout}
                        />
                    )}
                </Toolbar>
            </AppBar>
            <LoginDialog
                open={open}
                onClickClose={handleClose}
                onClickLogin={() => handleClickLogin()}
            />
        </div>
    );
}
