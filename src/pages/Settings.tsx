import {useBack, useTitle} from "../Root";
import {useProps} from "../App";
import {IconButton, Tooltip} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import {AttentionAppBar} from "../utils/AttentionAppBar";


export function Settings() {

    const {webApp} = useProps()

    const back = useBack()

    useTitle(webApp, 'Settings')
    // TODO
    return (
        <div>

            <AttentionAppBar title={"Settings"} back={<Tooltip title={'Home'}>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="home"
                    sx={{ mr: 2 }}
                    onClick={() => {
                        back('/')
                    }}
                >
                    <ArrowBack />
                </IconButton>
            </Tooltip>} settings={false} />
            <p>Settings!</p>
        </div>
        )
}

export default Settings
