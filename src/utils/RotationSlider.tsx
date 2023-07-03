import {Slider} from "@mui/material";
import {CSSProperties} from "react";

export default function RotationSlider(props: {onRotate: (angle: number) => void, style?: CSSProperties}) {
    // todo
    // we want a series of short, vertical lines that we can imagine are spaced equal angles around a circle
    // we can imagine they are around 90 degrees - so they should get closer together, more transparent, and shorter
    // according to the cosine
    // clicking and dragging should hide and lock the mouse into position, while moving the bars (having them disappear
    // on one side and appear on the other). The angle (1 decimal place) should smoothly animate into view above the bar
    // and disappear (after a short delay) with an animation after the mouse up
    // if the angle approaches a multiple of 90 degrees (within 1 degree?), it should "snap-to" (no animation?) until
    // the user drags the slider beyond the +/- 1 degree. If they do, it should not attempt to snap again until the
    // slider has moved more than +/- 5 degrees. This should be true initially (so it won't immediately snap to 0)
    return (<Slider style={props.style} defaultValue={0} max={180} min={-180} onChange={(event, value) => props.onRotate(Array.isArray(value) ? value[0] : value)} component={"div"}/>)
}