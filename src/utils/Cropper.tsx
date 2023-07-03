import {RefObject, useState} from "react";
import RotationSlider from "./RotationSlider";
import {Crop, PixelCrop, ReactCrop} from "react-image-crop";
import {alpha, IconButton, useTheme} from "@mui/material";
import {Close} from "@mui/icons-material";
import {LIST_ELEMENT_PADDING} from "./defs";

export default function Cropper(props: {onCrop: (crop: PixelCrop) => void, photo?: string, chooseNew: () => void, rotation: number, setRotation: (rotation: number) => void, imgRef: RefObject<HTMLImageElement>}) {
    const [crop, setCrop] = useState<Crop>()
    const theme = useTheme()

    // todo does not behave right - tall images overflow, short images leave lots of space
    // todo seems to crash when you try to crop
    return (<div style={{display: 'flex', flexDirection: 'column', height: 'calc(90vh - 150px)'}}>
        <div style={{flexGrow: 1, flexShrink: 1, minHeight: 0}}>
            <div style={{position: 'relative'}}>
                <IconButton sx={{backgroundColor:
                    alpha('#000', 0.5), color: 'white', '&:hover': {
                        backgroundColor: alpha('#000', 0.25)}}} style={{position: 'absolute', top: LIST_ELEMENT_PADDING, right: LIST_ELEMENT_PADDING, zIndex: 1}}>
                    <Close />
                </IconButton>
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => props.onCrop(c)}
                    aspect={1}
                    circularCrop={true}
                    style={{height: "100%"}}
                >
                    <img
                        ref={props.imgRef}
                        alt="Crop me"
                        src={props.photo}
                        style={{ transform: `rotate(${props.rotation}deg)`, height: "100%", width: "100%", objectFit: "contain", borderRadius: theme.shape.borderRadius}}/>
                </ReactCrop>
            </div>
        </div>
        <RotationSlider style={{flexGrow: 0}} onRotate={props.setRotation} />
    </div>)
}
