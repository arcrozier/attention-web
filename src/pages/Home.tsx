import React, {useCallback, useEffect, useRef, useState} from "react";
import {Friend, notify, useProps} from "../App";
import {SnackbarStatus, useAnimations, useLogout, useSnackBarStatus, useTitle} from "../Root";
import {AttentionAppBar} from "../utils/AttentionAppBar";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton, LinearProgress,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {FloatingDiv} from "../utils/FloatingDiv";
import {Close} from "@mui/icons-material";
import {DEFAULT_DELAY, LIST_ELEMENT_PADDING, UPDATE_INTERVAL} from "../utils/defs";
import {sendMessage} from "../utils/repository";
import {AxiosError} from "axios";
import {Transition, TransitionGroup} from "react-transition-group";

const DEFAULT_PFP_SIZE = "40pt"

enum FriendCardState {
    NORMAL,
    SEND,
    EDIT,
    CANCEL
}

interface FriendCardProps {
    friend: Friend,
    delay: number,
    darkMode: boolean,
    state: FriendCardState,
    setState: (state: FriendCardState) => void,
    setSnackBar: (snackbar: SnackbarStatus | null) => void,
}


function FriendCard(props: FriendCardProps) {
    const {friend, delay, state, setState, setSnackBar} = props;

    const overlayDuration = useAnimations() ? 100 : 0

    const logout = useLogout()

    const [sendingStatus, setSendingStatus] = useState<string | null>(null)
    const [sendError, setSendError] = useState(false)

    const style = {
        margin: `0 ${LIST_ELEMENT_PADDING} 0 ${LIST_ELEMENT_PADDING}`
    }

    const defaultStyle = {
        transition: `height ${overlayDuration}ms ease-in-out`,
        height: 0,
    }

    const transitionStyles = {
        entering: {size: 'auto', opacity: 1},
        entered: {size: 'auto', opacity: 1},
        exiting: {size: 0, opacity: 0},
        exited: {size: 0, opacity: 0},
        unmounted: {size: 0, opacity: 0}
    };

    const [displayX, setDisplayX] = useState(0)

    const [width, setWidth] = useState(0)
    const outerRef = useCallback((node: HTMLDivElement) => {
        if (node !== null) {
            setWidth(node.getBoundingClientRect().width);
        }
    }, []);

    const [addMessage, setAddMessage] = useState(false)
    const [name, setName] = useState(friend.name)
    const [nameDialog, setNameDialog] = useState(false)

    const [deleteDialog, setDeleteDialog] = useState(false)

    const [cancelProgress, setCancelProgress] = useState(0)

    const [message, setMessage] = useState<string | null>(null)
    let overlay: React.ReactElement | null


    useEffect(() => {
        if (state === FriendCardState.CANCEL) {
            const interval = setInterval(() => {
                setCancelProgress((prevState) => {
                    if (prevState + UPDATE_INTERVAL <= delay * 1000) {
                        return prevState + UPDATE_INTERVAL
                    }
                    return delay * 1000
                })
                if (cancelProgress >= delay * 1000) {
                    setState(FriendCardState.NORMAL)
                    setSendingStatus("Sending...")
                    setSendError(false)
                    sendMessage(friend.friend, message?.length === 0 ? null : message).then(() => {
                        setSnackBar({
                            severity: 'success',
                            message: 'Successfully sent alert',
                            autoHideDuration: 600
                        })
                    }).catch((e) => {
                        setSendError(true)
                        setSendingStatus('Error')
                        if (e instanceof AxiosError) {
                            const message = e.message
                            // TODO onclick for each notification
                            switch (e.status) {
                                case 403:
                                    if (message.includes('does not have you as a friend')) {
                                        const text = `Could not send message because ${friend.name} does not have you as a friend`
                                        setSnackBar({
                                            severity: 'error',
                                            message: notify(text) ? 'Error' : text,
                                            autoHideDuration: null
                                        })
                                    } else {
                                        logout()
                                    }
                                    break
                                case 400:
                                    if (message.includes('Could not find user')) {
                                        const text = `Could not send alert because ${friend.name} does not exist`
                                        setSnackBar({
                                            severity: 'error',
                                            message: notify(text) ? 'Error' : text,
                                            autoHideDuration: null
                                        })
                                    } else {
                                        const text = `Could not send alert to ${friend.name}`
                                        setSnackBar({
                                            severity: 'error',
                                            message: notify(text) ? 'Error' : text,
                                            autoHideDuration: null
                                        })
                                    }
                                    break
                                default:
                                    const text = `Could not send alert to ${friend.name}; check your network connection and try again`
                                    setSnackBar({
                                        severity: 'error',
                                        message: notify(text) ? 'Error' : text,
                                        autoHideDuration: null
                                    })
                            }
                        } else {
                            const text = `Could not send alert to ${friend.name}; check your network connection and try again`
                            setSnackBar({
                                severity: 'error',
                                message: notify(text) ? 'Error' : text,
                                autoHideDuration: null
                            })
                        }
                    })
                }
            }, UPDATE_INTERVAL)
            return () => {
                clearInterval(interval)
                setCancelProgress(0)
            }
        }
    }, [friend, delay, state, setState, setSnackBar, message, logout, cancelProgress])

    const theme = useTheme()
    const progressBG = props.darkMode ? theme.palette.primary.light : theme.palette.primary.dark
    const progressFG = props.darkMode ? theme.palette.primary.dark : theme.palette.primary.light

    switch (props.state) {
        case FriendCardState.SEND:
            overlay = <FloatingDiv parentWidth={width} positionX={displayX}>
                <IconButton style={style} aria-label={"close"} onClick={(e) => {
                    e.preventDefault()
                    props.setState(FriendCardState.NORMAL)
                }
                }>
                    <Close/>
                </IconButton>
                <Button style={style} variant={"contained"} onClick={(e) => {
                    e.preventDefault()
                    props.setState(FriendCardState.CANCEL)
                }
                }>
                    Send notification
                </Button>
                <Button style={style} onClick={(e) => {
                    e.preventDefault()
                    props.setState(FriendCardState.NORMAL)
                    setAddMessage(true)
                }
                } variant={"outlined"}>
                    Edit message
                </Button>
            </FloatingDiv>
            break
        case FriendCardState.EDIT:
            overlay = <FloatingDiv parentWidth={width} positionX={displayX}>
                <IconButton style={style} aria-label={"close"} onClick={(e) => {
                    e.preventDefault()
                    props.setState(FriendCardState.NORMAL)
                }
                }>
                    <Close/>
                </IconButton>
                <Button style={style} variant={"contained"} onClick={(e) => {
                    e.preventDefault()
                    props.setState(FriendCardState.NORMAL)
                    setNameDialog(true)
                }
                }>
                    Edit
                </Button>
                <Button style={style} color={"error"} onClick={(e) => {
                    e.preventDefault()
                    props.setState(FriendCardState.NORMAL)
                    setDeleteDialog(true)
                }
                } variant={"outlined"}>
                    Delete
                </Button>
            </FloatingDiv>
            break
        case FriendCardState.CANCEL:
            overlay = <div style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                backgroundColor: progressBG,
                display: "flex",
                alignItems: "center",
                justifyItems: "center",
                ...style
            }} onClick={(e) => {
                e.preventDefault()
                props.setState(FriendCardState.NORMAL)
            }
            }>
                <div style={{
                    width: `${cancelProgress / (1000 * props.delay)}%`,
                    height: "100%",
                    borderRadius: "1rem",
                    transition: `${UPDATE_INTERVAL / 1000}s linear`,
                    backgroundColor: progressFG,
                    position: "absolute",
                    zIndex: 0
                }}/>
                <div style={{zIndex: 1}}>
                    Cancel
                </div>
            </div>
            break
        default:
            overlay = null
    }

    let sendSubtitle
    if (sendingStatus !== null) {
        sendSubtitle = sendingStatus
    } else {
        sendSubtitle = friend.last_message_status
    }

    const ref = useRef(null)

    return (
        <div>
            <div style={{
                width: "100%",
                height: "48pt",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                cursor: "pointer",
                position: "relative"
            }} ref={outerRef} onClick={(e) => {
                e.preventDefault()
                console.log(e.nativeEvent)
                setDisplayX(e.clientX - e.currentTarget.getBoundingClientRect().left)
                switch (props.state) {
                    case FriendCardState.NORMAL:
                        props.setState(FriendCardState.SEND)
                        break
                    case FriendCardState.CANCEL:
                    case FriendCardState.SEND:
                    case FriendCardState.EDIT:
                        props.setState(FriendCardState.NORMAL)
                        break
                }
            }
            } onContextMenu={(e) => {
                e.preventDefault()
                setDisplayX(e.nativeEvent.offsetX)
                switch (props.state) {
                    case FriendCardState.NORMAL:
                    case FriendCardState.SEND:
                        props.setState(FriendCardState.EDIT)
                        break
                }
            }
            }>
                <div style={{
                    width: DEFAULT_PFP_SIZE,
                    height: DEFAULT_PFP_SIZE,
                    margin: "0 8pt 0 8pt"
                }}>
                    {friend.photo != null &&
                    <img style={{
                        height: DEFAULT_PFP_SIZE, width: DEFAULT_PFP_SIZE,
                        objectFit: "cover",
                        borderRadius: "50%"
                    }}
                         src={`data:image/png;base64,${friend.photo}`}
                         alt={`Profile for ${friend.name}`}/>}
                </div>
                <div style={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    justifyItems: 'center'
                }}>
                    <Typography variant={"h6"}>
                        {friend.name}
                    </Typography>
                    {friend.last_message_status !== null && sendingStatus !== null &&
                    <Typography variant={"subtitle2"} color={sendError ? 'error' : 'text.disabled'}>
                        {sendSubtitle}
                    </Typography>
                    }
                </div>
                <TransitionGroup>
                    <Transition nodeRef={ref} timeout={overlayDuration}>
                        {state => (
                            state !== 'exited' && state !== 'unmounted' && overlay !== null && overlay
                        )}
                    </Transition>
                </TransitionGroup>
                {/* TODO animate overlay with Transition */}
                <Dialog
                    onClose={() => setAddMessage(false)}
                    open={addMessage}>
                    <DialogTitle>Send custom message to {friend.name}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="message"
                            label={`Message to ${friend.name}`}
                            type="text"
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value)
                            }
                            }
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAddMessage(false)}>Cancel</Button>
                        <Button variant={"contained"} onClick={() => {
                            props.setState(FriendCardState.CANCEL)
                            setAddMessage(false)
                        }
                        }>Send</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    onClose={() => setNameDialog(false)}
                    open={nameDialog}>
                    <DialogTitle>Change name for {friend.friend}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="message"
                            label={`Name`}
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                            }
                            }
                            fullWidth
                            variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setNameDialog(false)}>Cancel</Button>
                        <Button variant={"contained"} onClick={() => {
                            // TODO send request
                            setNameDialog(false)
                        }
                        }>Okay</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    onClose={() => setDeleteDialog(false)}
                    open={deleteDialog}>
                    <DialogTitle>Delete {friend.name}?</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
                        <Button variant={"contained"} color={"error"} onClick={() => {
                            // TODO send request
                            setNameDialog(false)
                        }
                        }>Delete</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Divider variant={"middle"}/>
        </div>
    )
}


export function Home() {

    const {webApp, darkMode, userInfo} = useProps()

    const [, setSnackbar] = useSnackBarStatus()

    console.log(userInfo)

    const tempDelay = +(window.localStorage.getItem("delay") ?? DEFAULT_DELAY)
    const delay = isNaN(tempDelay) ? DEFAULT_DELAY : tempDelay

    useTitle(webApp, 'Home')

    const [cardState, setCardState] = useState(new Map())

    const friends = userInfo == null ? [] : userInfo.friends.map((value) =>
        <li key={value.friend} style={{listStyle: "none"}}>
            <FriendCard friend={value}
                        delay={delay}
                        darkMode={darkMode}
                        state={cardState.has(value.friend) ? cardState.get(value.friend) : FriendCardState.NORMAL}
                        setState={(state) => {
                            setCardState((val) => {
                                const clone = new Map(val);
                                clone.set(value.friend, state)
                                return clone
                            })
                        }}
                        setSnackBar={setSnackbar}/>
        </li>
    )

    return (
        <div className="App">
            <AttentionAppBar title={"Attention!"} back={null} settings={true}/>
            <ul style={{padding: 0, margin: 0}}>
                {friends}
            </ul>
        </div>
    );
}

export default Home
