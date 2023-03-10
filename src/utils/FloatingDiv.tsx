import React, {useCallback, useState} from "react";

export interface FloatingDivProps {
    parentWidth: number,
    positionX: number,
    children?: React.ReactNode | React.ReactNode[]
}

export function FloatingDiv(props: FloatingDivProps) {
    const [innerWidth, setInnerWidth] = useState(0)

    const ref = useCallback((node: HTMLDivElement) => {
        if (node !== null) {
            setInnerWidth(node.getBoundingClientRect().width);
        }
    }, []);

    return (<div style={{
        position: "absolute",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        left: `${Math.max(0, Math.min(props.parentWidth - innerWidth, props.positionX - innerWidth / 2))}px`,
    }} ref={ref}>
        {props.children}
    </div>)
}
