import {AppBar, IconButton, Toolbar, Typography, useScrollTrigger} from "@mui/material";
import {Link} from "react-router-dom";
import {Refresh, Settings} from "@mui/icons-material";
import React from "react";

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

export interface AppBarProps {
    title: string,
    back: React.ReactElement | null,
    settings: boolean
}

export function AttentionAppBar(props: AppBarProps) {
    return (
        <ElevationScroll>
            <AppBar position="static" color={"primary"} enableColorOnDark>
                <Toolbar>
                    {props.back}
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1 }}>
                        {props.title}
                    </Typography>

                    <div>
                        <IconButton size={"large"} aria-label={"refresh"} onClick={() => {
                            // todo
                        }}>
                            <Refresh />
                        </IconButton>
                        {props.settings && <IconButton
                            size="large"
                            aria-label="settings"
                            aria-controls="menu-appbar"
                            component={Link} to={'settings'}  state={{
                            goBack: true
                        }}
                            color="inherit"
                        >
                            <Settings />
                        </IconButton>}
                    </div>
                </Toolbar>
            </AppBar>


        </ElevationScroll>
    )
}
