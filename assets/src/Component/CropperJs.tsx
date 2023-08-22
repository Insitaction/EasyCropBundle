import React, { useState, useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {Box, Modal, Typography} from "@mui/material";
import {FormInput} from "../Type/FormInput";
import {FormCropped} from "../Type/FormCropped";
import {FormLabel} from "../Type/FormLabel";

export const CropperJs: React.FC = (props: { cropBtn?: String; formFile?: FormInput; formLabel?: FormLabel; formCropped?: FormCropped }) => {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const [image, setImage] = useState("");
    const [cropData, setCropData] = useState("");
    const cropperRef = useRef<ReactCropperElement>(null);
    const onChange = (e: any) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result as any);
        };
        reader.readAsDataURL(files[0]);
        setOpen(true)
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            // @ts-ignore
            setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
        }
        setOpen(false)
    };

    if (undefined === props.cropBtn || undefined === props.formLabel || undefined === props.formFile || undefined === props.formCropped) {
        console.error("Unexpected error, some props are undefined.")
        return (<></>);
    }

    return (
        <div>
            <input
                type={"file"}
                className={props.formFile.class}
                title={props.formFile.title}
                name={props.formFile.name}
                id={props.formFile.id}
                placeholder={props.formFile.placeholder}
                onChange={onChange}
                required={props.formFile.required}
            />
            <input type={"hidden"}
                className={props.formCropped.class}
                name={props.formCropped.name}
                id={props.formCropped.id}
                value={cropData}
                required={props.formCropped.required}
            />
            <label htmlFor={props.formLabel.for} className={props.formLabel.class}></label>


            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>


            <div style={{ width: "100%" }}>
                <Cropper
                    style={{ height: 400, width: "100%" }}
                    initialAspectRatio={1}
                    preview=".img-preview"
                    src={image}
                    ref={cropperRef}
                    viewMode={1}
                    guides={true}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                />
            </div>
            <div style={{ textAlign: "center", padding: "20px" }}>
                <button className="btn btn-primary action-save" onClick={getCropData}>
                    <span className="btn-label">
                        <i className="action-icon fa fa-crop"></i>
                        <span className="action-label">  {props.cropBtn}</span>
                    </span>
                </button>
            </div>
            <br style={{ clear: "both" }} />
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
};

export default CropperJs;
