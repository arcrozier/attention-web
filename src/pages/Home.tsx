import React, {useCallback, useState} from "react";
import {Friend, useProps} from "../App";
import {useTitle} from "../Root";
import {AttentionAppBar} from "../utils/AttentionAppBar";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton, TextField,
    Typography
} from "@mui/material";
import {FloatingDiv} from "../utils/FloatingDiv";
import {Close} from "@mui/icons-material";
import {LIST_ELEMENT_PADDING} from "../utils/defs";

const DEFAULT_PFP_SIZE = "40pt"

enum FriendCardState {
    NORMAL,
    SEND,
    EDIT,
    CANCEL
}


interface FriendCardProps {
    friend: Friend,
    state: FriendCardState,
    setState: (state: FriendCardState) => void,
}


function FriendCard(props: FriendCardProps) {
    const friend = props.friend

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

    const [message, setMessage] = useState<string | null>(null)
    let overlay: React.ReactElement | null

    switch (props.state) {
        case FriendCardState.NORMAL:
            overlay = null
            break
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
        default:
            overlay = null
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
            <div style={{flexGrow: 1}}>
                <Typography variant={"h6"}>
                    {friend.name}
                </Typography>
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
        </div>
    )
}


export function Home() {

    const {webApp, userInfo} = useProps()

    console.log(userInfo)

    useTitle(webApp, 'Home')

    const [cardState, setCardState] = useState(new Map())

    const friends = userInfo == null ? [] : userInfo.friends.map((value) =>
        <li key={value.friend} style={{listStyle: "none"}}>
            <FriendCard friend={value}
                        state={cardState.has(value.friend) ? cardState.get(value.friend) : FriendCardState.NORMAL}
                        setState={(state) => {
                            setCardState((val) => {
                                const clone = new Map(val);
                                clone.set(value.friend, state)
                                return clone
                            })
                        }}/>
        </li>
    )

    // TODO reload?

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
