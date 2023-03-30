import React, {useCallback, useState} from "react";

export interface FloatingDivProps {
    parentWidth: number,
    positionX: number,
    children?: React.ReactNode | React.ReactNode[],
    innerRef?: React.MutableRefObject<any>,
    style?: React.CSSProperties,
}

export function FloatingDiv(props: FloatingDivProps) {
    // initial size needs to be greater than or equal to the eventual size, otherwise
    // the calculation may scrunch the div too close to the right
    const [innerWidth, setInnerWidth] = useState(props.parentWidth)

    const ref = useCallback((node: HTMLDivElement) => {
        if (node !== null) {
            setInnerWidth(node.getBoundingClientRect().width);
            if (props.innerRef != null) {
                props.innerRef.current = node
            }
        }
    }, []);


    return (<div style={{
        ...props.style,
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
