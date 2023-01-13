import React, {useState} from "react";
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
    setState: (state: FriendCardState, card: string) => void,
}


function FriendCard(props: FriendCardProps) {
    const friend = props.friend

    return (
        <div style={{
            width: "100%",
            height: "48pt",
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
        }}>
            <div style={{width: DEFAULT_PFP_SIZE, height: DEFAULT_PFP_SIZE, margin: "0 8pt 0 8pt"}}>
                {friend.photo != null &&
                <img style={{
                    height: DEFAULT_PFP_SIZE, width: DEFAULT_PFP_SIZE,
                    objectFit: "cover",
                    borderRadius: "50%"
                }}
                     src={`data:image/png;base64,${friend.photo}`}
                     alt={`Profile photo for ${friend.name}`}/>}
            </div>
            <div style={{flexGrow: 1}}>
                <Typography variant={"h6"}>
                    {friend.name}
                </Typography>
            </div>
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
