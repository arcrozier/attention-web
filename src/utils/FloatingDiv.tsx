import React, {useLayoutEffect, useRef, useState} from "react";

export interface FloatingDivProps {
    parentWidth: number,
    positionX: number,
    children?: React.ReactNode | React.ReactNode[]
}

export function FloatingDiv(props: FloatingDivProps) {
    const ref = useRef<HTMLDivElement>(null)

    const [innerWidth, setInnerWidth] = useState(0)
    useLayoutEffect(() => {
        if (ref.current != null) setInnerWidth(ref.current.clientWidth)
    })

    return (<div style={{
        position: "absolute",
        height: "100%", // TODO too big
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        left: `${Math.max(0, Math.min(props.parentWidth - innerWidth, props.positionX - innerWidth / 2))}px`,
        backgroundColor: "red"
    }} ref={ref}>
        {props.children}
    </div>)
}
