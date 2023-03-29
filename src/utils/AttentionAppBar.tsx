import {
    AppBar,
    IconButton,
    LinearProgress,
    styled,
    Toolbar,
    Typography,
    useScrollTrigger
} from "@mui/material";
import {Link, useRevalidator} from "react-router-dom";
import {Refresh, Settings} from "@mui/icons-material";
import React, {useRef} from "react";
import {Transition} from 'react-transition-group';
import {useAnimations} from "../Root";

interface Props {
    children: React.ReactElement;
}

function ElevationScroll(props: Props) {
    const {children} = props;

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0
    });

    return React.cloneElement(children, {
        elevation: trigger ? 10 : 0,
    });
}

export interface AppBarProps {
    title: string,
    back: React.ReactElement | null,
    settings: boolean
}

export function AttentionAppBar(props: AppBarProps) {

    const duration = useAnimations() ? 200 : 0;

    const defaultStyle = {
        transition: `height ${duration}ms ease-in-out`,
        height: 0,
    }

    const transitionStyles = {
        entering: {height: '4px'},
        entered: {height: '4px'},
        exiting: {height: 0},
        exited: {height: 0},
        unmounted: {height: 0}
    };

    const revalidator = useRevalidator()
    const ref = useRef(null)
    const Offset = styled('div')(({theme}) => theme.mixins.toolbar);
    return (
        <div>
            <div style={{position: "fixed", width: "100%", zIndex: 1}}>
                <ElevationScroll>
                    <AppBar position="static" color={"primary"} enableColorOnDark
                            sx={{backgroundImage: 'unset'}}>
                        <Toolbar>
                            {props.back}
                            <Typography
                                variant="h5"
                                noWrap
                                component="div"
                                sx={{flexGrow: 1}}>
                                {props.title}
                            </Typography>

                            <div>
                                <IconButton size={"large"} aria-label={"refresh"} onClick={() => {
                                    revalidator.revalidate()
                                }}>
                                    <Refresh/>
                                </IconButton>
                                {props.settings && <IconButton
                                    size="large"
                                    aria-label="settings"
                                    aria-controls="menu-appbar"
                                    component={Link} to={'settings'} state={{
                                    goBack: true
                                }}
                                    color="inherit"
                                >
                                    <Settings/>
                                </IconButton>}
                            </div>
                        </Toolbar>
                    </AppBar>


                </ElevationScroll>
                <Transition nodeRef={ref} in={revalidator.state === 'loading'} timeout={duration}>
                    {state => (
                        state !== 'exited' && state !== 'unmounted' && <LinearProgress ref={ref}
                                                                                     style={{...defaultStyle, ...transitionStyles[state]}}/>
                    )}
                </Transition>
            </div>

            <Offset/>
        </div>


    )
}
