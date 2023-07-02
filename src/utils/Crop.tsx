import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {RefObject, useState} from "react";
import RotationSlider from "./RotationSlider";

export default function Crop(props: {innerRef: RefObject<ReactCropperElement>, photo?: string, chooseNew: () => void}) {
    const [rotation, setRotation] = useState(0)
    // todo need close button
    // todo need rotate slider - looks like this'll need to be from scratch
    return (<div>
        <Cropper
        ref={props.innerRef}
        style={{ height: 400, width: "100%" } /* todo not sure about this */}
        zoomTo={0.5}
        initialAspectRatio={1}
        aspectRatio={1}
        preview=""
        src={props.photo}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        rotatable={true}
        zoomable={false}
        movable={false}
        scalable={true}
        rotateTo={rotation}
        responsive={true}
        autoCropArea={1}
        checkOrientation={true} // https://github.com/fengyuanchen/cropperjs/issues/671
        guides={true}
    />
        <RotationSlider onRotate={setRotation} />
    </div>)
}
