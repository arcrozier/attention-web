import React from "react";

export const LIST_ELEMENT_PADDING = "8pt"
export const SESSION_ID_COOKIE = "sessionid"

export const usernameChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const filtered = event.target.value.replaceAll(/[^a-zA-Z0-9@_\-+.]/gm, '')
    return filtered.substring(0, 150)
}

export const stripNewlines = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    return event.target.value.replaceAll(/\n/gm, '')
}

export const couldBeEmail = (email: string): boolean => {
    return email.toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) !== null
}


export interface TextFieldStatus {
    error: boolean,
    message: string,
}

export const SINGLE_LINE: React.CSSProperties = {textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden"}

export const DEFAULT_DELAY = 3.5

interface ButtonProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    onClick?: (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
}

export function UnstyledButton(props: ButtonProps) {
    console.log(props)
    return (<div {...{
        role: "button", onKeyDown: (e) => {
            if ((e.key === "Enter" || e.key === " ")) {
                e.preventDefault()
                if (props.onClick) props.onClick(e)
            }
        }, tabIndex: 0, ...props
    }}>
        {props.children}
    </div>)
}
