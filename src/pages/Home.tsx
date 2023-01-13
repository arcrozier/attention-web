import React, {useLayoutEffect, useRef, useState} from "react";
import {Friend, useProps} from "../App";
import {useTitle} from "../Root";
import {AttentionAppBar} from "../utils/AttentionAppBar";
import {Typography} from "@mui/material";

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

    const [displayX, setDisplayX] = useState(0)

    const outerRef = useRef<HTMLDivElement>(null)
    const innerRef = useRef<HTMLDivElement>(null)

    const [width, setWidth] = useState(0)
    const [innerWidth, setInnerWidth] = useState(0)
    useLayoutEffect(() => {
        if (outerRef.current != null) setWidth(outerRef.current.clientWidth)
        if (innerRef.current != null) setInnerWidth(innerRef.current.clientWidth)
    })

    console.log(`${displayX}, ${width}, ${innerWidth}`)

    let contents: React.ReactElement | null
    switch (props.state) {
        case FriendCardState.NORMAL:
            contents = null
            break
        case FriendCardState.SEND:
            contents = null
            break
        default:
            contents = null
    }
    const overlay = contents == null ? null : (

        <div style={{
            position: "absolute",
            height: "100%",
            width: "40px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            left: `${Math.max(0, Math.min(width - innerWidth, displayX - innerWidth / 2))}px`,
            backgroundColor: "red"
        }} ref={innerRef}>
            {contents}
        </div>
    )

    return (
        <div style={{
            width: "100%",
            height: "48pt",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer"
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
