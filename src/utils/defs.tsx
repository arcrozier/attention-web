import React from "react";

export const LIST_ELEMENT_PADDING = "16pt"

export const usernameChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const filtered = event.target.value.replaceAll(/[^a-zA-Z@_\-+.]/gm, '')
    return filtered.substring(0, 150)
}

export const passwordChanged = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    return event.target.value.replaceAll(/\n/gm, '')
}

export interface TextFieldStatus {
    error: boolean,
    message: string,
}
