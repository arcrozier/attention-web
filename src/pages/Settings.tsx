import {useBack, useTitle} from "../Root";
import {useProps} from "../App";
import {AppBar, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";


export function Settings() {

    const {webApp} = useProps()

    const back = useBack()

    useTitle(webApp, 'Settings')
    // TODO
    return (
        <div>

            <AppBar position="static">
                <Toolbar>
                    <Tooltip title={'Home'}>
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
                    </Tooltip>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Settings
                    </Typography>
                </Toolbar>
            </AppBar>
            <p>Settings!</p>
        </div>
        )
}

export default Settings
