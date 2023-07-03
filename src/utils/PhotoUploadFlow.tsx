import {useDropzone} from 'react-dropzone'
import {lazy, ReactElement, RefObject, Suspense, useCallback, useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import "../css/dropzone.css"
import {PixelCrop} from "react-image-crop";

enum UploadState {
    UPLOAD, CROP
}

function Dropzone(props: {onDrop: (acceptedFile: File[]) => void}) {
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: props.onDrop, multiple: false, accept: {
            'image/*': []
        }})

    // todo substantial styling needed to match the rest of the app (doesn't change themes, most notably); animate border? needs greater border radius
    return (<div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag and drop photo or click to select</p>
    </div>)
}

export default function PhotoUploadFlow(props: {onCrop: (crop: PixelCrop) => void, setPhoto: (photo: string) => void, photo?: string, rotation: number, setRotation: (rotation: number) => void, imgRef: RefObject<HTMLImageElement>}) {

    const {setPhoto} = props
    const [state, setState] = useState(UploadState.UPLOAD)

    const onDrop = useCallback((acceptedFile: File[]) => {
        // Do something with the files
        setPhoto(URL.createObjectURL(acceptedFile[0]))
        setState(UploadState.CROP)
    }, [setPhoto])


    const Crop = lazy(() => import('./Cropper'))

    let Content;
    switch (state) {
        case UploadState.UPLOAD:
            Content = () => (<Dropzone onDrop={onDrop} />)
            break
        case UploadState.CROP:
            Content = () => (<Suspense fallback={<CircularProgress/>}>
                <Crop chooseNew={() => setState(UploadState.UPLOAD)} {...props}/>
            </Suspense>)
    }

    return (
        <Content />
    )
}
