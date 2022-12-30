import React from "react";

export const LIST_ELEMENT_PADDING = "16pt"

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
