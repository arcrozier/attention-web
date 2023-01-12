import React from "react";
import {Friend, useProps} from "../App";
import {useTitle} from "../Root";
import {AttentionAppBar} from "../utils/AttentionAppBar";

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
        <div style={{width: "100%", height: "72pt", display: "flex", flexDirection: "row", alignItems: "center"}}>
            <div style={{width: DEFAULT_PFP_SIZE, height: DEFAULT_PFP_SIZE, margin: "0 8pt 0 8pt"}}>
                {friend.photo != null &&
                    <img style={{height: DEFAULT_PFP_SIZE, width: DEFAULT_PFP_SIZE,
                        objectFit: "cover",
                        borderRadius: "50%"}}
                         src={`data:image/png;base64,${friend.photo}`}
                         alt={`Profile photo for ${friend.name}`}/>}
            </div>
            <div style={{flexGrow: 1}}>
                {friend.name}
            </div>
        </div>
    )
}


export function Home() {

    const {webApp, userInfo} = useProps()

    console.log(userInfo)

    useTitle(webApp, 'Home')


    const friends = userInfo == null ? [] : userInfo.friends.map((value) =>
        <li key={value.friend} style={{listStyle: "none"}}><FriendCard friend={value} state={FriendCardState.NORMAL} setState={() => {}} /></li>
    )

    // TODO reload?

    return (
        <div className="App">
            <AttentionAppBar title={"Attention!"} back={null} settings={true} />
            <ul style={{padding: "0px"}}>
                {friends}
            </ul>
        </div>
    );
}

export default Home
