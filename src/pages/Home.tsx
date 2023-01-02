import React from "react";
import {Friend, useProps} from "../App";
import {useTitle} from "../Root";
import {
    AppBar,
    IconButton,
    Toolbar,
    Typography,
    useScrollTrigger
} from "@mui/material";
import {Settings} from "@mui/icons-material";
import {Link} from "react-router-dom";


enum FriendCardState {
    NORMAL,
    SEND,
    EDIT,
    CANCEL
}


interface FriendCardProps {
    friend: Friend,
    state: FriendCardState,
    setState: (state: FriendCardState, card: string) => void,
}


function FriendCard(props: FriendCardProps) {

}


export function Home() {

    const {webApp, userInfo} = useProps()

    console.log(userInfo)

    useTitle(webApp, 'Home')

    interface Props {
        children: React.ReactElement;
    }

    function ElevationScroll(props: Props) {
        const { children } = props;
        // Note that you normally won't need to set the window ref as useScrollTrigger
        // will default to window.
        // This is only being set here because the demo is in an iframe.
        const trigger = useScrollTrigger({
            disableHysteresis: true,
            threshold: 0
        });

        return React.cloneElement(children, {
            elevation: trigger ? 4 : 0,
        });
    }

    // TODO reload?

    return (
        <div className="App">
            <ElevationScroll>
            <AppBar position="static" color={"primary"} enableColorOnDark>
                <Toolbar>

                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, alignSelf: 'flex-end' }}>
                        Attention!
                    </Typography>

                    <div>
                        <IconButton
                            size="large"
                            aria-label="settings"
                            aria-controls="menu-appbar"
                            component={Link} to={'settings'}  state={{
                            goBack: true
                        }}
                            color="inherit"
                        >
                            <Settings />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>


            </ElevationScroll>
            <p>Home!</p>
        </div>
    );
}

export default Home
