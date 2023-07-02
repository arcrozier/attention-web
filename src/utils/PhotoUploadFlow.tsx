import {useDropzone} from 'react-dropzone'
import {lazy, ReactElement, RefObject, Suspense, useCallback, useState} from "react";
import {ReactCropperElement} from "react-cropper";
import {CircularProgress} from "@mui/material";

enum UploadState {
    UPLOAD, CROP
}

export default function PhotoUploadFlow(props: {innerRef: RefObject<ReactCropperElement>}) {

    const [state, setState] = useState(UploadState.UPLOAD)

    const [photo, setPhoto] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFile: File[]) => {
        // Do something with the files
        setPhoto(URL.createObjectURL(acceptedFile[0]))
        setState(UploadState.CROP)
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false, accept: {
        'image/*': []
        }})

    const Crop = lazy(() => import('./Crop'))

    let Content;
    switch (state) {
        case UploadState.UPLOAD:
            Content = () => (<div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag and drop photo or click to select</p>
            </div>)
            break
        case UploadState.CROP:
            Content = () => (<Suspense fallback={<CircularProgress/>}>
                <Crop innerRef={props.innerRef} photo={photo ? photo : undefined} chooseNew={() => setState(UploadState.UPLOAD)}/>
            </Suspense>)
    }

    return (
        <Content />
    )
}
