import {useDropzone} from 'react-dropzone'
import {lazy, RefObject, useCallback, useState} from "react";
import {ReactCropperElement} from "react-cropper";

enum UploadState {
    UPLOAD, CROP
}

export default function PhotoUploadFlow(props: {innerRef: RefObject<ReactCropperElement>}) {

    const [state, setState] = useState(UploadState.UPLOAD)

    const onDrop = useCallback((acceptedFile: File[]) => {
        // Do something with the files
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, multiple: false, accept: {
        'image/*': []
        }})

    const Crop = lazy(() => import('./Crop'))

    return (
        <div></div>
    )
}
