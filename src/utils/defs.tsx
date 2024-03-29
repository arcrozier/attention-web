import React from "react";
import {alpha, ButtonBase, ButtonBaseProps, styled} from "@mui/material";

export const LIST_ELEMENT_PADDING = "8pt"
export const SESSION_ID_COOKIE = "sessionid"

export const usernameChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    return filterUsername(event.target.value)
}

export const filterUsername = (candidate: string): string => {
    const filtered = candidate.replaceAll(/[^a-zA-Z0-9@_\-+.]/gm, '')
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

interface ButtonProps extends ButtonBaseProps {
    onClick?: (event: React.MouseEvent<any> | React.KeyboardEvent<any>) => void,
    ref?: undefined,
}

const MUnstyledButton = styled(ButtonBase)<ButtonProps>(({theme}) => {
    return {
        alignItems: 'start',
        textAlign: 'start',
        transition: theme.transitions.create(
            ['background-color', 'box-shadow', 'border-color', 'color'],
            {
                duration: theme.transitions.duration.short,
            },
        ),
        '&:hover': {
            textDecoration: 'none',
            backgroundColor:
                alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity),
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        }
    }
})

export const UnstyledButton = ({focusRipple, ...props}: ButtonProps) => {
    return (
        <MUnstyledButton
            focusRipple={focusRipple !== undefined ? focusRipple : true} {...{component: 'div', ...props}}>{props.children}</MUnstyledButton>
    )
}
