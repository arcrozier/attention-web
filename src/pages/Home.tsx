import React, {useCallback, useEffect, useState} from "react";
import {Friend, notify, useProps} from "../App";
import {SnackbarStatus, useLogout, useSnackBarStatus, useTitle} from "../Root";
import {AttentionAppBar} from "../utils/AttentionAppBar";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, TextField,
    Typography, useTheme
} from "@mui/material";
import {FloatingDiv} from "../utils/FloatingDiv";
import {Close} from "@mui/icons-material";
import {DEFAULT_DELAY, LIST_ELEMENT_PADDING, UPDATE_INTERVAL} from "../utils/defs";
import {sendMessage} from "../utils/repository";
import {AxiosError} from "axios";

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
    const friend = props.friend

    const logout = useLogout()

    const [sendingStatus, setSendingStatus] = useState<string | null>(null)
    const [sendError, setSendError] = useState(false)

    const style = {
        margin: `0 ${LIST_ELEMENT_PADDING} 0 ${LIST_ELEMENT_PADDING}`
    }

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
        if (props.state === FriendCardState.CANCEL) {
            const interval = setInterval(() => {
                setCancelProgress((prevState) => {
                    if (prevState + UPDATE_INTERVAL <= props.delay * 1000) {
                        return prevState + UPDATE_INTERVAL
                    }
                    return props.delay * 1000
                })
                if (cancelProgress >= props.delay * 1000) {
                    props.setState(FriendCardState.NORMAL)
                    setSendingStatus("Sending...")
                    setSendError(false)
                    sendMessage(friend.friend, message?.length === 0 ? null : message).then(() => {
                        props.setSnackBar({
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
                                        props.setSnackBar({
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
                                        props.setSnackBar({
                                            severity: 'error',
                                            message: notify(text) ? 'Error' : text,
                                            autoHideDuration: null
                                        })
                                    } else {
                                        const text = `Could not send alert to ${friend.name}`
                                        props.setSnackBar({
                                            severity: 'error',
                                            message: notify(text) ? 'Error' : text,
                                            autoHideDuration: null
                                        })
                                    }
                                    break
                                default:
                                    const text = `Could not send alert to ${friend.name}; check your network connection and try again`
                                    props.setSnackBar({
                                        severity: 'error',
                                        message: notify(text) ? 'Error' : text,
                                        autoHideDuration: null
                                    })
                            }
                        } else {
                            const text = `Could not send alert to ${friend.name}; check your network connection and try again`
                            props.setSnackBar({
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
    }, [props.delay, props.state])

    const progressBG = props.darkMode ? useTheme().palette.primary.light : useTheme().palette.primary.dark
    const progressFG = props.darkMode ? useTheme().palette.primary.dark : useTheme().palette.primary.light

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

    return (
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
            <div style={{width: DEFAULT_PFP_SIZE, height: DEFAULT_PFP_SIZE, margin: "0 8pt 0 8pt"}}>
                {friend.photo != null &&
                <img style={{
                    height: DEFAULT_PFP_SIZE, width: DEFAULT_PFP_SIZE,
                    objectFit: "cover",
                    borderRadius: "50%"
                }}
                     src={`data:image/png;base64,${friend.photo}`}
                     alt={`Profile for ${friend.name}`}/>}
            </div>
            <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'left', justifyItems: 'center'}}>
                <Typography variant={"h6"}>
                    {friend.name}
                </Typography>
                {friend.last_message_status !== null && sendingStatus !== null &&
                    <Typography variant={"subtitle2"} color={sendError ? 'error' : 'text.disabled'}>
                        {sendSubtitle}
                </Typography>
                }
            </div>
            {overlay !== null && overlay}
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
