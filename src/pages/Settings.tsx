import {useTitle} from "../Root";
import {useProps, UserInfo} from "../App";
import {LIST_ELEMENT_PADDING, SINGLE_LINE, UnstyledButton} from "../utils/defs";
import {
    Box,
    Button,
    ClickAwayListener,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    IconButton,
    InputAdornment,
    Popper,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import Color from "color"
import React, {useMemo, useRef, useState} from "react";
import {Await} from "react-router-dom";
import '../animations.css'
import {AxiosResponse} from "axios";
import {APIResult} from "../utils/repository";
import {AccountCircleOutlined, Check, ContentCopy, Share} from "@mui/icons-material";
import {SwitchTransition, Transition} from "react-transition-group";

const ICON_SIZE = "40px"
const PREFERENCE_SIZE = "72px"

interface PreferenceProps<T> {
    icon?: React.ReactNode,
    title: string,
    value: T,
    action?: React.ReactNode,
    summary?: ((value: T) => string) | null,
    onClick?: (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void,
    enabled?: boolean,
    titleColor?: string,
    summaryColor?: string,
    disabledTitleColor?: string,
    disabledSummaryColor?: string
}

interface DialogPreferenceProps<T> extends PreferenceProps<T> {
    dialog: React.ComponentType<DialogProps<any>>,
    setValue: (newValue: T) => void
}

interface DialogProps<T> {
    value: T,
    setValue: (newValue: T) => void,
    dismissDialog: () => void,
    open: boolean,
    title: string
}

function Preference<T>(props: PreferenceProps<T>) {
    const theme = useTheme()
    const summary = props.summary === null ? null : props.summary !== undefined ? props.summary(props.value) : "" + props.value;

    const titleColor = useMemo(() => {
        return props.titleColor ? props.titleColor : Color(theme.palette.getContrastText(theme.palette.background.default)).hexa()
    }, [props.titleColor, theme.palette])
    const summaryColor = useMemo(() => {
        return props.summaryColor ? props.summaryColor : Color(theme.palette.getContrastText(theme.palette.background.default)).fade(0.25).hexa()
    }, [props.summaryColor, theme.palette])


    return (
        <UnstyledButton style={{
            width: "100%",
            height: PREFERENCE_SIZE,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
            cursor: "pointer"
        }} onClick={props.onClick}>
            <div style={{
                height: ICON_SIZE,
                width: ICON_SIZE,
                overflow: "hidden",
                flexGrow: 0,
                flexShrink: 0,
                marginRight: LIST_ELEMENT_PADDING
            }}>
                {props.icon}
            </div>
            <div style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                overflow: "hidden"
            }}>
                <Typography variant={"subtitle1"} style={{color: titleColor, ...SINGLE_LINE}}>{props.title}</Typography>
                {Boolean(summary) &&
                    <Typography variant={"body2"} style={{color: summaryColor, ...SINGLE_LINE}}>{summary}</Typography>}
            </div>
            {props.action}
        </UnstyledButton>
    )
}

function DialogPreference<T>(props: DialogPreferenceProps<T>) {

    const [editing, setEditing] = useState(false)

    return (
        <div>
            <props.dialog value={props.value} setValue={props.setValue} open={editing} dismissDialog={() => {
                setEditing(false)
            }}
                          title={props.title}/>
            <Preference {...{
                ...props, onClick: (e) => {
                    e.stopPropagation()
                    setEditing((prevState) => {
                        return !prevState;

                    })
                }
            }}/>
        </div>
    )
}

function PreferenceGroup(props: { title: string, children: React.ReactNode, first?: boolean }) {
    const theme = useTheme()
    return (<div style={{width: "100%", borderTop: `${props.first ? 'none' : 'solid'} thin ${theme.palette.divider}`}}>
        <Typography variant={"h4"}>{props.title}</Typography>
        {props.children}
    </div>)
}

function SplitPreference(props: { small: React.ReactNode, large: React.ReactNode }) {
    const theme = useTheme()
    return (<div
        style={{width: "100%", height: PREFERENCE_SIZE, display: "flex", flexDirection: "row", alignItems: "center"}}>
        <div style={{flexGrow: 1, height: "100%"}}>
            {props.large}
        </div>
        <div style={{flexGrow: 0, width: "1px", height: "75%", backgroundColor: theme.palette.divider}}/>
        <div style={{flexGrow: 0, height: "100%", width: PREFERENCE_SIZE}}>
            {props.small}
        </div>
    </div>)
}

function ShareButton(props: { text: string }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = useState(false)
    const theme = useTheme()
    const id = open && Boolean(anchorEl) ? 'transition-popper' : undefined
    const [copied, setCopied] = useState(false)

    const copyAnimationDuration = 250
    const copyHoldDuration = 3 * 1000 // 3 seconds (3000 ms)

    const copy = () => {
        navigator.clipboard.writeText(props.text).then(() => {
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, copyHoldDuration)
        })
    }

    const handleClick = (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
        event.stopPropagation()
        setOpen((previousOpen) => {
            if (!previousOpen) {
                // we're opening the popup
                copy()
            }
            return !previousOpen
        })
    };

    const checkRef = React.useRef<null | HTMLDivElement>(null)
    const copyRef = React.useRef<null | HTMLDivElement>(null)
    const nodeRef = copied ? copyRef : checkRef

    const buttonRef = React.useRef<null | HTMLButtonElement>(null)

    return (
        <div style={{
            height: "100%",
            width: "100%"
        }} onKeyDown={(e) => {
            if (e.key === "Escape") {
                setOpen(false)
                if (buttonRef.current) {
                    buttonRef.current?.focus()
                }
            }
        }}>
            <IconButton ref={buttonRef} onClick={handleClick} style={{
                height: "100%",
                width: "100%"
            }}>
                <Share style={{width: ICON_SIZE, height: ICON_SIZE}}/>
            </IconButton>
            <ClickAwayListener onClickAway={() => {
                setOpen(false)
                console.log("Clicked away")
            }} mouseEvent={open ? 'onClick' : false} touchEvent={open ? 'onTouchEnd' : false}>
                <Popper id={id} open={open} anchorEl={anchorEl} placement={'top'} transition>
                    {({TransitionProps}) => (
                        <Fade {...TransitionProps /* Wanted to use Collapse but there's a bug https://github.com/mui/material-ui/issues/11337 */}
                              timeout={350}>
                            <Box sx={{
                                border: 1,
                                borderRadius: "5px",
                                p: 1,
                                bgcolor: 'background.paper',
                                color: theme.palette.getContrastText(theme.palette.background.paper)
                            }}>
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <TextField value={props.text} autoFocus={true} InputProps={{
                                        endAdornment: <InputAdornment position={"end"}>
                                            <SwitchTransition mode={'out-in'}>
                                                <Transition key={copied ? "bar" : "foo"}
                                                            timeout={copyAnimationDuration}
                                                            unmountOnExit
                                                            mountOnEnter
                                                            nodeRef={nodeRef}
                                                >
                                                    {state => <div ref={nodeRef} style={{
                                                        transition: `${copyAnimationDuration}ms`,
                                                        opacity: state === "entered" ? 1 : 0,
                                                        display: state === "exited" ? "none" : "block"
                                                    }}>
                                                        <IconButton onClick={copy}>
                                                            {copied ? <Check color={"success"}/> : <ContentCopy/>}

                                                        </IconButton>
                                                    </div>}
                                                </Transition>
                                            </SwitchTransition>
                                        </InputAdornment>
                                    }}/>
                                    <IconButton onClick={() => {
                                        navigator.share({text: props.text})
                                    }}>
                                        <Share/>
                                    </IconButton>
                                </div>
                            </Box>
                        </Fade>
                    )}
                </Popper>
            </ClickAwayListener>

        </div>
    )
}

function PhotoSelectDialog(props: { onDone: (photo: string) => void, onCancel: () => void }) {
    return (<div>
        Not yet implemented
    </div>)
}

function UsernamePreference(props: { userInfo: Awaited<AxiosResponse<APIResult<UserInfo>>> }) {
    const {
        username,
        photo
    } = props.userInfo.data.data ? props.userInfo.data.data : {username: "Error: no username found", photo: null}
    const [newUsername, setNewUsername] = useState(username)
    const [photoDialog, setPhotoDialog] = useState(false)

    const PhotoElement = photo ? () => (

        <img src={`data:image/png;base64,${photo}`}
             alt={`Your profile photo - click to set`}
             style={{width: "100%", height: "100%", borderRadius: "50%"}}

        />

    ) : () => (
        <AccountCircleOutlined
            style={{width: "100%", height: "100%"}}
            />
    )
    return (<SplitPreference small={
        <ShareButton text={`Add me on Attention! https://attention.aracroproducts.com/app/add?username=${username}`}/>
    } large={<DialogPreference<string> dialog={(props: DialogProps<string>) => (
        <Dialog open={props.open} onClose={(e) => {
            if ("isPropagationStopped" in e) {
                // need to stop propagation because dialog is a child of the preference and it will propagate up and
                // eventually "click" on the preference, reopening it
                e.isPropagationStopped = () => true
            }
            props.dismissDialog()
        }}>
            <DialogTitle>Change username</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="username"
                    label={`New username`}
                    type="text"
                    value={newUsername}
                    onChange={(e) => {
                        setNewUsername(e.target.value)
                    }
                    }
                    fullWidth
                    variant="standard"></TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={(e) => {
                    props.dismissDialog()
                    e.stopPropagation()
                }}>Cancel</Button>
                <Button variant={"contained"} onClick={(e) => {
                    e.stopPropagation()
                    // todo make request, block button until request completes
                }
                }>OK</Button>
            </DialogActions>
        </Dialog>
    )
    }
                                       setValue={
                                           (newValue) => {
                                               // todo make request with new username
                                           }
                                       } title={"Username"} value={username} icon={
        <div>
            <IconButton style={{height: "100%", width: "100%", padding: 0}} onClick={(e) => {
                e.stopPropagation()
                console.log("PFP clicked")
                setPhotoDialog(true)
                // todo open dialog that allows for drag and drop or click
            }
            }>

                <PhotoElement/>
            </IconButton>
            {photoDialog && <PhotoSelectDialog onDone={(photo) => {
                // todo upload photo
                // and honestly this should have async imports
                // see: https://www.npmjs.com/package/react-dropzone (will need some styling)
                // And this: https://www.npmjs.com/package/react-image-crop
                //  or this: https://www.npmjs.com/package/react-cropper
                setPhotoDialog(false)
            }} onCancel={() => {
                setPhotoDialog(false)
            }}/>
            }
        </div>

    }/>}/>)
}

// How to handle large screens:
//  ugly (just a wide version of the normal screen)
//      slight improvement: on wide screens, center text like login screen
export function Settings() {

    const {webApp, darkMode, userInfo} = useProps()
    const theme = useTheme()

    useTitle(webApp, 'Settings')
    // TODO

    const ref = useRef<HTMLDivElement | null>(null)

    const start = useMemo(() => Date.now(), [])
    const [finished, setFinished] = useState(false)

    userInfo?.then(() => {
        setTimeout(() => {
            setFinished(true)
            if (ref.current !== null) {
                ref.current.className = 'opacity1'
            }
        }, 10)
    })

    return (
        <React.Suspense fallback={null}>
            <Await resolve={userInfo} errorElement={<div style={{
                margin: 0,
                display: "flex",
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <p>An error occurred</p>
            </div>}>
                {(userInfo: Awaited<AxiosResponse<APIResult<UserInfo>>>) => (
                    <div ref={ref} className={Date.now() - start > 100 && !finished ? 'opacity0' : 'opacity1'} style={{
                        width: "500pt",
                        maxWidth: "95%",
                        transition: "opacity 1s",
                        borderRadius: "10px",
                        borderWidth: "thin",
                        margin: "auto",
                        borderStyle: "solid",
                        marginTop: "5vh",
                        marginBottom: "5vh",
                        padding: "10px"
                    }}>
                        <PreferenceGroup title={"Account"} first={true}>
                            <UsernamePreference userInfo={userInfo}/>
                            <Preference onClick={() => {
                                console.log("preference clicked")
                            }} icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>}
                                        title={"Pref 1"} value={1} summary={(v) => {
                                if (v === 1) return "one"; else return "idk " + v
                            }}/>
                            <Preference title={"Pref 2"} value={2}/>
                            <Preference icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>}
                                        title={"Pref 3"} value={3} summary={(v) => {
                                return "value ".repeat(v).repeat(v).repeat(v)
                            }}/>
                            <Preference title={"Pref 2"} value={2}
                                        titleColor={darkMode ? theme.palette.error.dark : theme.palette.error.light}/>
                        </PreferenceGroup>
                        <PreferenceGroup title={"Notifications"} first={false}>
                            <Preference icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>}
                                        title={"Pref 1"} value={1} summary={(v) => {
                                if (v === 1) return "one"; else return "idk " + v
                            }}/>
                            <Preference title={"Pref 2"} value={2}/>
                            <Preference icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>}
                                        title={"Pref 3"} value={3} summary={(v) => {
                                return "value ".repeat(v).repeat(v).repeat(v)
                            }}/>
                            <Preference title={"Pref 2"} value={2}
                                        titleColor={darkMode ? theme.palette.error.dark : theme.palette.error.light}/>
                        </PreferenceGroup>
                        <PreferenceGroup title={"Legal"}>
                            <Preference icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>}
                                        title={"Pref 1"} value={1} summary={(v) => {
                                if (v === 1) return "one"; else return "idk " + v
                            }}/>
                            <Preference title={"Pref 2"} value={2}/>
                            <Preference icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>}
                                        title={"Pref 3"} value={3} summary={(v) => {
                                return "value ".repeat(v).repeat(v).repeat(v)
                            }}/>
                            <Preference title={"Pref 2"} value={2}
                                        titleColor={darkMode ? theme.palette.error.dark : theme.palette.error.light}
                                        summary={null}/>
                        </PreferenceGroup>
                    </div>
                )}
            </Await>
        </React.Suspense>

    )
}

export default Settings
